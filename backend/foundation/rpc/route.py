"""
This module contains various helper functions, endpoint decorators, and
utilities for the web application package.
"""

import functools
import json
import logging
from dataclasses import asdict, dataclass, field
from typing import Any, Awaitable, Callable, Generic, Literal, TypeVar

import pydantic.dataclasses
import quart
from pydantic import ValidationError
from quart import ResponseReturnValue

from codegen.sqlc.models import Tenant, User
from codegen.sqlc.queries import AsyncQuerier
from foundation.db import Conn, ConnPool, conn_admin, conn_cust
from foundation.rpc.catalog import catalog_global_error, catalog_route
from foundation.rpc.error import (
    APIError,
)

logger = logging.getLogger(__name__)

SESSION_USER_ID_KEY = "user_external_id"
HEADER_TENANT_EXTERNAL_ID_KEY = "X-Tenant-ID"

Authorization = Literal["public", "user", "tenant"]


D = TypeVar("D")


@dataclass
class Req(Generic[D]):
    conn: Conn
    q: AsyncQuerier
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
    name: str,
    in_: type[Any] | None,
    out: type[Any] | None,
    errors: list[type[APIError]],
    authorization: Authorization,
    # This is for tests. Some tests may not want to mount their temporary routes
    # into the global catalog because the temporary route is re-defined in every test,
    # leading to test pollution in the global scope.
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
                data = await _validate_data(in_)
                logger.info("Validated request data.")

                # 6. Configure the customer's database connection with
                # row-level-security (if logged in). Then execute the request.
                conn_ctx = conn_cust(pg_pool, user, tenant) if user else conn_admin(pg_pool)
                async with conn_ctx as conn:
                    q = AsyncQuerier(conn)
                    req = Req(
                        data=data,
                        user=user,
                        tenant=tenant,
                        conn=conn,
                        q=q,
                        pg_pool=pg_pool,
                    )
                    logger.info(f"Entering request handler with {user is None}.")
                    rdata = await func(req)
                    logger.info("Exited request handler.")

                return quart.jsonify(asdict(rdata) if rdata else {"ok": True}), 200
            except APIError as e:
                logger.debug(f"API endpoint returned error: {e=} {e.serialize()=}")
                return quart.jsonify(e.serialize()), 400
            except Exception as e:  # pragma: no cover
                logger.warning(f"Unknown error from endpoint handler: {e}")
                return quart.jsonify(UnknownError().serialize()), 500

        # Register the route and handler into the RPC catalog.
        if mount:
            catalog_route(name=name, in_=in_, out=out, errors=errors, handler=handler)

        return handler

    return decorator


async def _check_session_auth(conn: Conn) -> tuple[User | None, Tenant | None]:
    """
    Check the current request's session authentication. If so, fetch the associated user
    and the tenant they're logged in as.
    """
    q = AsyncQuerier(conn)

    user_external_id = quart.session.get(SESSION_USER_ID_KEY, None)
    tenant_external_id = quart.request.headers.get(HEADER_TENANT_EXTERNAL_ID_KEY, None)

    user = None
    tenant = None

    logger.info(f"User ID found in session: {user_external_id is not None}")
    if user_external_id:
        user = await q.user_fetch_ext(external_id=str(user_external_id))
        logger.info(f"User found: {user is not None}")
    # Only look for the tenant if the user exists. Otherwise we could potentially be
    # leaking the existence of a tenant.
    logger.info(f"Tenant ID found in headers: {tenant_external_id is not None}")
    if user and tenant_external_id:
        tenant = await q.rpc_fetch_tenant_associated_with_user(
            user_id=user.id,
            external_id=str(tenant_external_id),
        )
        logger.info(f"Tenant found: {tenant is not None}")

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


async def _validate_data(spec: type[T] | None) -> T | None:
    """
    This decorates a quart endpoint. Taking a pydantic input dataclass as an argument,
    this decorator parses the request data with that dataclass. If parsing fails, this
    decorator returns an error to the requester.
    """
    if spec is None:
        return None

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
