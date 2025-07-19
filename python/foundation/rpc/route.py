"""
This module contains various helper functions, endpoint decorators, and
utilities for the web application package.
"""

import functools
import json
from collections.abc import Awaitable, Callable
from dataclasses import asdict, dataclass, field
from typing import Any, Literal, TypeVar, get_args, get_type_hints

import pydantic.dataclasses
import quart
from pydantic import ValidationError
from quart import ResponseReturnValue

from database.access.xact import DBQuerier, xact_admin, xact_customer
from database.codegen import models
from foundation.errors import ImpossibleError
from foundation.logs import get_logger
from foundation.rpc.catalog import Method, catalog_global_error, catalog_raw_route, catalog_rpc
from foundation.rpc.error import RPCError
from foundation.str import snake_case_to_pascal_case

logger = get_logger()

SESSION_ID_KEY = "session_external_id"

Authorization = Literal["public", "user", "tenant"]


class InvalidRPCDefinitionError(Exception):
    pass


D = TypeVar("D")


@dataclass
class Req[D]:
    q: DBQuerier
    user: models.User | None
    tenant: models.Tenant | None
    data: D


@dataclass
class UnknownError(RPCError):
    pass


@dataclass
class UnauthorizedError(RPCError):
    pass


@dataclass
class ServerJSONDeserializeError(RPCError):
    message: str


@dataclass
class DataMismatchError(RPCError):
    message: str


@dataclass
class InputValidationError(RPCError):
    message: str
    fields: dict[str, Any] = field(default_factory=dict)


catalog_global_error(UnauthorizedError)
catalog_global_error(ServerJSONDeserializeError)
catalog_global_error(DataMismatchError)
catalog_global_error(InputValidationError)


def route(
    *,
    authorization: Authorization,
    errors: list[type[RPCError]],
    method: Method = "POST",
    # Whether this is a raw route or not.
    type_: Literal["rpc", "raw"] = "rpc",
    # This is for tests. Some tests may not want to mount their temporary routes into the global
    # catalog because the temporary route is re-defined in every test, leading to test pollution in
    # the global scope.
    mount: bool = True,
) -> Callable[
    [Callable[[Req[Any]], Awaitable[Any]]],
    Callable[[], Awaitable[ResponseReturnValue]],
]:
    """
    This decorator registers a RPC route into the RPC system and wraps the RPC route with the
    request preflight code.

    The RPC system contains a catalog of all RPC routes that is used to:
    1. Register handlers on the Quart webserver.
    2. Codegen backend and frontend type bindings.

    The request preflight code:
    1. Starts a trace.
    2. Traps exceptions and convert them into API responses.
    3. Authenticates the user via the session.
    4. Authorizes the user against the specified authorization level.
    5. If `in_` is not None, parses the input data into it.
    6. Sets up the database connection and configures Postgres row-level-security.
    """

    def decorator(
        func: Callable[[Req[Any]], Awaitable[Any]],
    ) -> Callable[[], Awaitable[ResponseReturnValue]]:
        type_hints = get_type_hints(func)

        # Infer the RPC name, input dataclass, and output dataclass from the type parameters.
        name = snake_case_to_pascal_case(func.__name__)
        out = type_hints.get("return", type(None))

        in_: type[Any] = type(None)
        try:
            args = get_args(type_hints["req"])
            if args:
                in_ = args[0]
        except KeyError as e:
            # We look for the request type by examining the function parameter named `req`. If the
            # function takes a parameter of a different name, we cannot pull its types.
            raise InvalidRPCDefinitionError(f"RPC handlers must take in a parameter named `req`. Failed to wrap {name}") from e

        # Turn the input dataclass into a Pydantic dataclass for validation purposes.
        if in_.__name__ != "NoneType":
            in_ = pydantic.dataclasses.dataclass(in_)

        @functools.wraps(func)
        async def handler() -> ResponseReturnValue:
            # TODO: 1. OpenTelemetry trace
            # 2. Trap exceptions and convert them into API responses.
            try:
                # 3. Authenticate the user.
                user, tenant = await _check_session_auth()

                # 4. Authorize the user against the authorization level.
                await _check_authorization(authorization, user, tenant)
                logger.info("Request passed user authorization check.")

                # 5. Parse input data.
                data = await _validate_data(in_, method)
                logger.info("Validated request data.")

                # 6. Configure the customer's database connection with
                # row-level-security (if logged in). Then execute the request.
                transaction = xact_customer(user.id, tenant.id) if user else xact_admin()
                async with transaction as q:
                    req = Req(data=data, user=user, tenant=tenant, q=q)
                    logger.info(f"Entering request handler with {user is None}.")
                    rdata = await func(req)
                    logger.info("Exited request handler.")

                # A raw handler should handle its own return value.
                if type_ == "raw":
                    return rdata  # type: ignore
                # But an RPC handler returns a dataclass that we serialize.
                return quart.jsonify(asdict(rdata) if rdata else {"ok": True}), 200
            except RPCError as e:
                logger.debug(f"API endpoint returned error: {e=} {e.serialize()=}")
                return quart.jsonify(e.serialize()), 400
            except Exception as e:  # pragma: no cover
                logger.warning(f"Unknown error from endpoint handler: {e}")
                return quart.jsonify(UnknownError().serialize()), 500

        # Register the route and handler into the RPC catalog.
        if mount:
            if type_ == "raw":
                catalog_raw_route(name=name, method=method, handler=handler)
            else:
                catalog_rpc(
                    name=name,
                    in_=in_,
                    out=out,
                    errors=errors,
                    method=method,
                    handler=handler,
                )

        return handler

    return decorator


async def _check_session_auth() -> tuple[models.User | None, models.Tenant | None]:
    """
    Check the current request's session authentication. If so, fetch the associated user
    and the tenant they're logged in as.
    """
    session_external_id = quart.session.get(SESSION_ID_KEY, None)

    user = None
    tenant = None

    logger.info(f"Session ID found in session: {session_external_id is not None}")
    if session_external_id:
        async with xact_admin() as q:
            session = await q.orm.rpc_unexpired_session_fetch(external_id=session_external_id)
            logger.info(f"Session found: {session is not None}")
            if session is not None:
                user = await q.orm.user_fetch(id=session.user_id)
                if session.tenant_id is not None:
                    tenant = await q.orm.tenant_fetch(id=session.tenant_id)

    return user, tenant


async def _check_authorization(
    authorization: Authorization,
    user: models.User | None,
    tenant: models.Tenant | None,
) -> None:
    """
    Validate that the user is authorized to submit a request this endpoint. For now, we
    only check the existence of a user, but this function can be expanded to RBAC
    systems or equivalents in the future.
    """
    if authorization == "public":
        return
    if authorization == "user":
        if user is None:
            raise UnauthorizedError
        return
    if authorization == "tenant":
        if user is None or tenant is None:
            raise UnauthorizedError
        return
    raise ImpossibleError("Missed authorization type check in _check_authorization.")  # pragma: no cover


T = TypeVar("T")


async def _validate_data[T](spec: type[T], method: Method) -> T | None:
    """
    This decorates a quart endpoint. Taking a pydantic input dataclass as an argument,
    this decorator parses the request data with that dataclass. If parsing fails, this
    decorator returns an error to the requester.
    """
    if spec.__name__ == "NoneType":
        return None

    if method == "GET":
        data = quart.request.args.to_dict()
    else:
        raw_data = await quart.request.get_data()
        try:
            data = json.loads(raw_data) if raw_data else {}
        except json.JSONDecodeError as e:
            logger.info(f"Input JSON decode failure: {e}")
            raise ServerJSONDeserializeError(message="Failed to deserialize input to JSON.") from e

    try:
        return spec(**data)
    except TypeError as e:
        logger.info(f"Input pydantic parse failure: {e}")
        raise DataMismatchError(message="Failed to parse request data: incorrect type.") from e
    except ValidationError as e:
        logger.info(f"Input pydantic validation failure: {e}")
        fields = {}
        for field_error in e.errors():
            fields[str(field_error["loc"][0])] = field_error["msg"]
        raise InputValidationError(
            message="Failed to validate request data.",
            fields=fields,
        ) from e
