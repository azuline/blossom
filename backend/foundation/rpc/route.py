"""
This module contains various helper functions, endpoint decorators, and
utilities for the web application package.
"""

import functools
import json
import logging
from collections.abc import Awaitable, Callable
from dataclasses import asdict, dataclass, field
from typing import Any, Generic, Literal, TypeVar

import pydantic.dataclasses
import quart
from pydantic import ValidationError
from quart import ResponseReturnValue

from codegen.sqlc.models import Tenant, User
from foundation.database import ConnPool, ConnQuerier, conn_admin, conn_cust
from foundation.rpc.catalog import (
    Method,
    catalog_global_error,
    catalog_raw_route,
    catalog_rpc,
)
from foundation.rpc.error import (
    APIError,
)

logger = logging.getLogger(__name__)

SESSION_ID_KEY = "session_external_id"

Authorization = Literal["public", "user", "tenant"]


D = TypeVar("D")


@dataclass
class Req(Generic[D]):
    cq: ConnQuerier
    user: User | None
    tenant: Tenant | None
    data: D

    # Less-used values, here for convenience.
    pg_pool: ConnPool


@dataclass
class UnknownError(APIError):
    pass


@dataclass
class UnauthorizedError(APIError):
    pass


@dataclass
class ServerJSONDeserializeError(APIError):
    message: str


@dataclass
class DataMismatchError(APIError):
    message: str


@dataclass
class InputValidationError(APIError):
    message: str
    fields: dict[str, Any] = field(default_factory=dict)


catalog_global_error(UnauthorizedError)
catalog_global_error(ServerJSONDeserializeError)
catalog_global_error(DataMismatchError)
catalog_global_error(InputValidationError)


def route(
    *,
    authorization: Authorization,
    errors: list[type[APIError]],
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
    # TODO: Infer these from the types in this scope
    in_ = None
    out = None
    name = ""

    def decorator(
        func: Callable[[Req[Any]], Awaitable[Any]]
    ) -> Callable[[], Awaitable[ResponseReturnValue]]:
        @functools.wraps(func)
        async def handler() -> ResponseReturnValue:
            # TODO: 1. OpenTelemetry trace
            # 2. Trap exceptions and convert them into API responses.
            try:
                pg_pool: ConnPool = quart.current_app.config["PG_POOL"]

                # 3. Authenticate the user.
                async with conn_admin(pg_pool) as conn:
                    user, tenant = await _check_session_auth(conn)

                # 4. Authorize the user against the authorization level.
                await _check_authorization(authorization, user, tenant)
                logger.info("Request passed user authorization check.")

                # 5. Parse input data.
                data = await _validate_data(in_, method)
                logger.info("Validated request data.")

                # 6. Configure the customer's database connection with
                # row-level-security (if logged in). Then execute the request.
                conn_ctx = conn_cust(pg_pool, user, tenant) if user else conn_admin(pg_pool)
                async with conn_ctx as cq:
                    req = Req(
                        data=data,
                        user=user,
                        tenant=tenant,
                        cq=cq,
                        pg_pool=pg_pool,
                    )
                    logger.info(f"Entering request handler with {user is None}.")
                    rdata = await func(req)
                    logger.info("Exited request handler.")

                # A raw handler should handle its own return value.
                if type_ == "raw":
                    return rdata
                # But an RPC handler returns a dataclass that we serialize.
                return quart.jsonify(asdict(rdata) if rdata else {"ok": True}), 200
            except APIError as e:
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


async def _check_session_auth(cq: ConnQuerier) -> tuple[User | None, Tenant | None]:
    """
    Check the current request's session authentication. If so, fetch the associated user
    and the tenant they're logged in as.
    """
    session_external_id = quart.session.get(SESSION_ID_KEY, None)

    user = None
    tenant = None

    logger.info(f"Session ID found in session: {session_external_id is not None}")
    if session_external_id:
        session = await cq.q.rpc_fetch_unexpired_session(external_id=session_external_id)
        logger.info(f"Session found: {session is not None}")
        if session is not None:
            user = await cq.q.user_fetch(id=session.user_id)
            if session.tenant_id is not None:
                tenant = await cq.q.tenant_fetch(id=session.tenant_id)

    return user, tenant


async def _check_authorization(
    authorization: Authorization,
    user: User | None,
    tenant: Tenant | None,
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
            raise UnauthorizedError()
        return
    if authorization == "tenant":
        if user is None or tenant is None:
            raise UnauthorizedError()
        return
    raise Exception("Missed authorization type check in _check_authorization.")  # pragma: no cover


T = TypeVar("T")


async def _validate_data(spec: type[T] | None, method: Method) -> T | None:
    """
    This decorates a quart endpoint. Taking a pydantic input dataclass as an argument,
    this decorator parses the request data with that dataclass. If parsing fails, this
    decorator returns an error to the requester.
    """
    if spec is None:
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

    pydantic.dataclasses.dataclass(spec)
    with pydantic.dataclasses.set_validation(spec, True):  # type: ignore
        try:
            return spec(**data)
        except TypeError as e:
            logger.info(f"Input pydantic parse failure: {e}")
            raise DataMismatchError(
                message="Failed to parse request data: mismatching fields."
            ) from e
        except ValidationError as e:
            logger.info(f"Input pydantic validation failure: {e}")
            fields = {}
            for field_error in e.errors():
                fields[str(field_error["loc"][0])] = field_error["msg"]
            raise InputValidationError(
                message="Failed to validate request data.",
                fields=fields,
            ) from e
