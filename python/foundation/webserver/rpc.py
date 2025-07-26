import asyncio
import dataclasses
import datetime
import functools
import json
from collections import defaultdict
from collections.abc import Awaitable, Callable
from typing import Any, Literal, cast, get_args, get_type_hints

import pydantic
import quart

from foundation.env import ENV
from foundation.observability.errors import BaseError, ConfigurationError, ImpossibleError
from foundation.observability.logs import get_logger
from foundation.observability.metrics import metric_count_and_time
from foundation.observability.spans import span, tag_current_span
from foundation.stdlib.parse import make_pydantic_validator
from foundation.stdlib.unset import Unset

# TODO: CORS
# TODO: Metrics
# TODO: Request ID

logger = get_logger()

type MethodEnum = Literal["GET", "POST"]


@dataclasses.dataclass(slots=True)
class RPCError(BaseError):
    def __init__(self) -> None:
        self.message = self.__class__.__name__

    def serialize(self) -> dict[str, Any]:
        return {"error": self.__class__.__name__, "data": dataclasses.asdict(self)}


class RPCOutputJSONEncoder(json.JSONEncoder):
    def default(self, o):
        if dataclasses.is_dataclass(o) and not isinstance(o, type):
            return dataclasses.asdict(o)
        elif isinstance(o, (datetime.datetime, datetime.date)):
            return {"__sentinel": "timestamp", "value": o.isoformat()}
        elif isinstance(o, Unset):
            raise ValueError("unset type is not supported for outgoing RPC payloads")
        return super().default(o)  # pragma: no cover


def jsonify_output(d: Any) -> str:
    """
    By default, jsonify serializes dataclass for frontend consumption. Special types are serialized
    to a special sentinel-augmented format that the frontend understands. However, the backend does
    not understand or accept this format for its own input.

    But when testing input, we want to serialize all our types too. We want to convert the input as
    if it were from frontend to backend. The `dest` parameter controls the intended recipient of the
    jsonification. By default, it is `ts`, but when crafting testing input for handlers, it should
    be `py`.
    """
    if d is None:
        data = {"ok": True}
    elif isinstance(d, RPCError):
        data = d.serialize()
    elif dataclasses.is_dataclass(d) and not isinstance(d, type):
        data = dataclasses.asdict(d)
    elif isinstance(d, dict):
        data = d
    else:  # pragma: no cover
        raise ImpossibleError("Unknown type passed into jsonify", d=d, type=type(d))
    return json.dumps(data, cls=RPCOutputJSONEncoder)


class InvalidRPCDefinitionError(BaseError):
    pass


@dataclasses.dataclass(slots=True)
class UnknownError(RPCError):
    pass


@dataclasses.dataclass(slots=True)
class RPCTimeoutError(RPCError):
    pass


@dataclasses.dataclass(slots=True)
class ServerJSONDeserializeError(RPCError):
    message: str


@dataclasses.dataclass(slots=True)
class InputValidationError(RPCError):
    message: str
    fields: dict[str, Any] = dataclasses.field(default_factory=dict)


@dataclasses.dataclass(slots=True)
class ReqCommon[In]:
    data: In
    raw: quart.Request


@dataclasses.dataclass(frozen=True, slots=True)
class RPCRoute[In, Out]:
    name: str
    in_: type[In]
    out: type[Out]
    errors: list[type[RPCError]] = dataclasses.field(compare=False)
    method: MethodEnum
    handler: Callable[[], Awaitable[quart.Response]] = dataclasses.field(compare=False)

    def mount(self, app: quart.Quart) -> None:
        path = f"/rpc/{self.name}"
        logger.debug("mounting route", path=path, name=self.name, method=self.method)
        app.route(path, methods=[self.method])(self.handler)


def rpc_common(
    name: str,
    *,
    errors: list[type[RPCError]],
    # Default to POST and prefer to keep all methods as POST, as our application is usually
    # method-agnostic. GET methods should only be used for prefetching and redirects.
    method: MethodEnum = "POST",
    # For testing; should not be modified in production.
    timeout: float = 30,
) -> Callable[[Callable[[ReqCommon[Any]], Awaitable[Any]]], RPCRoute]:
    """
    This decorator creates a RPC route out of a Python function. It wraps the function with standard
    request preflight code. The returned RPC Route can be mounted onto the Router. The route records
    the types of the handler for later code generation.

    The common request preflight code:

        1. Traps exceptions and convert them into API responses.
        2. If `in_` is not None, parses the input data into it.

    This decorator is not meant for direct use by application users. It contains preflight and
    postflight code applicable to all applications. Each application should create a more specific
    `@rpc_{app}` which handles user authentication and request transaction setup.
    """

    def decorator[In, Out](func: Callable[[ReqCommon[In]], Awaitable[Out]]) -> RPCRoute[In, Out]:
        logger.debug("converting handler into decorated route", name=name, method=method)

        type_hints = get_type_hints(func)
        # Infer the input and output dataclasses from the type parameters.
        out = type_hints.get("return", type(None))

        in_: type[In]
        try:
            args = get_args(type_hints["req"])
            in_ = args[0]
        except KeyError as e:  # pragma: no cover
            # We look for the request type by examining the function parameter named `req`. If the
            # function takes a parameter of a different name, we cannot pull its types.
            raise InvalidRPCDefinitionError(f"RPC handlers must take in a parameter named `req`. Failed to wrap {name}") from e
        except IndexError as e:  # pragma: no cover
            raise InvalidRPCDefinitionError(f"The RPC handler `req` parameter must take in one type argument (which can be None). Failed to wrap {name}") from e

        # Turn the input dataclass into a Pydantic dataclass for validation purposes.
        in_spec = make_pydantic_validator(in_) if in_.__name__ != "NoneType" else None

        @functools.wraps(func)
        async def common_wrapper() -> quart.Response:
            raw_req = quart.request
            with span("webserver.rpc", rpc=name, method=method), metric_count_and_time("webserver.rpc", rpc=name, method=method) as ctags:
                try:
                    data = await _parse_request(in_spec, raw_req)
                    logger.debug("entering request handler function in common decorator")
                    req = ReqCommon(data=data, raw=raw_req)
                    # Set up a 30 second timeout for the request handler.
                    func_out = await asyncio.wait_for(func(req), timeout=timeout)
                    logger.debug("completed request handler function in common decorator")
                    tag_current_span(status_code=200)
                    ctags.tag(status_code=200)
                    if not isinstance(func_out, quart.Response):
                        logger.debug("converting response data into fastapi Response object")
                        return quart.Response(response=jsonify_output(func_out), status=200, headers={"Content-Type": "application/json"})
                    return func_out
                except RPCError as e:
                    tag_current_span(status_code=400, error=e.__class__.__name__)
                    ctags.tag(status_code=400, error=e.__class__.__name__)
                    logger.debug("rpc endpoint returned error", error=e.__class__.__name__, data=e.serialize())
                    return quart.Response(response=jsonify_output(e), status=400, headers={"Content-Type": "application/json"})
                except TimeoutError as e:
                    tag_current_span(status_code=504, error=e.__class__.__name__)
                    ctags.tag(status_code=504, error=e.__class__.__name__)
                    logger.exception("request handler timed out")
                    return quart.Response(response=jsonify_output(RPCTimeoutError()), status=504, headers={"Content-Type": "application/json"})
                except Exception as e:  # pragma: no cover
                    tag_current_span(status_code=500, error=e.__class__.__name__)
                    ctags.tag(status_code=500, error=e.__class__.__name__)
                    logger.exception("unhandled exception in endpoint handler")
                    return quart.Response(response=jsonify_output(UnknownError()), status=500, headers={"Content-Type": "application/json"})

        # We don't support codegen types for raw responses.
        if issubclass(out, quart.Response):
            out = cast(type[Out], type(None))

        return RPCRoute(name=name, in_=in_, out=out, errors=errors, method=method, handler=common_wrapper)

    return decorator


async def _parse_request[T](spec: Callable[[Any], T] | None, req: quart.Request) -> T:
    """
    This decorates an RPC endpoint. Taking a pydantic input dataclass as an argument, this decorator
    parses the request data with that dataclass. If parsing fails, this decorator returns an error
    to the requester.
    """
    if not spec:
        logger.debug("skipping validation request data, no input spec")
        return cast(T, None)

    logger.debug("validating request data", spec=spec)
    if req.method == "GET":
        data = quart.request.args.to_dict()
    else:
        raw_data = await quart.request.get_data()
        try:
            data = json.loads(raw_data) if raw_data else {}
        except json.JSONDecodeError as e:
            logger.warning(f"Input JSON decode failure: {e}")
            raise ServerJSONDeserializeError(message="Failed to deserialize input to JSON.") from e

    try:
        return spec(data)
    except pydantic.ValidationError as e:
        logger.warning(f"Input pydantic validation failure: {e}")
        fields = {}
        for field_error in e.errors():
            loc = field_error.get("loc", [])
            key = ".".join(map(str, loc)) or "__root__"
            fields[key] = field_error["msg"]
        raise InputValidationError(message="Failed to validate request data.", fields=fields) from e


# Flags used to mark routes for special codegen behaviors.
RouteFlag = Literal[
    # We hide some endpoints of the customer-facing product inside the panopticon backend because it
    # guarantees that only admins can access those endpoints. These are all admin operations that
    # expose data or behaviors that we never want to provide customers access to.
    "god_mode",
]


class RPCRouter:
    def __init__(self, product_specific_standard_errors: list[type[RPCError]]) -> None:
        self.standard_errors: list[type[RPCError]] = [ServerJSONDeserializeError, InputValidationError, *product_specific_standard_errors]
        self.routes: list[RPCRoute] = []
        self.route_flags: dict[RPCRoute, list[RouteFlag]] = defaultdict(list)
        self._route_name_set: set[str] = set()
        self.raw_blueprints: list[quart.Blueprint] = []

    def add_route(self, r: RPCRoute, *, flags: list[RouteFlag] | None = None) -> None:
        logger.debug("adding route to router", name=r.name)
        if r.name in self._route_name_set:
            raise ConfigurationError(f"Duplicate route name: {r.name}. Not allowed! Bad developer!")
        self._route_name_set.add(r.name)
        self.routes.append(r)
        if flags:
            self.route_flags[r].extend(flags)

    def add_raw_blueprint(self, r: quart.Blueprint) -> None:
        logger.debug("adding raw route to router", name=r.name)
        self.raw_blueprints.append(r)


def ping_handler() -> dict[str, str | bool]:
    return {"ok": True, "version": ENV.version}
