"""
This module contains various helper functions, endpoint decorators, and
utilities for the web application package.
"""

import dataclasses
import functools
from collections.abc import Awaitable, Callable
from typing import Literal

import quart

from database.__codegen_db__.models import OrganizationModel, UserModel
from database.conn import DBConn
from database.xact import xact_admin, xact_customer
from foundation.observability.errors import ImpossibleError, NotFoundError, RPCError
from foundation.observability.logs import get_logger
from foundation.observability.spans import tag_current_span
from foundation.webserver.rpc import MethodEnum, ReqCommon, RPCRoute, rpc_common
from product.framework.__codegen_db__.queries import query_rpc_unexpired_session_fetch
from product.organizations.__codegen_db__.queries import query_organization_fetch
from product.users.__codegen_db__.queries import query_user_fetch

logger = get_logger()

SESSION_ID_KEY = "session_id"

type Authorization = Literal[
    # Public means that anyone can access this endpoint.
    "public",
    # User means that any logged in user can access this endpoint, even if they are not authed with an
    # organization.
    "user",
    # Organization means that the requester must be authed with an organization.
    "organization",
]


@dataclasses.dataclass(slots=True)
class ReqProduct[In](ReqCommon[In]):
    conn: DBConn
    user: UserModel | None
    organization: OrganizationModel | None
    data: In


@dataclasses.dataclass(slots=True)
class UnauthorizedError(RPCError):
    pass


def rpc_product[In, Out](
    name: str,
    *,
    authorization: Authorization,
    errors: list[type[RPCError]],
    method: MethodEnum = "POST",
) -> Callable[[Callable[[ReqProduct[In]], Awaitable[Out]]], RPCRoute[In, Out]]:
    """
    Product wrapper around `rpc_common` with two augmentations. ALWAYS use this for `product` endpoints.

    1. Authenticates the user via the session.
    2. Sets up the request transaction with Row-Level Security based on the user auth.
    """

    def decorator(func: Callable[[ReqProduct[In]], Awaitable[Out]]) -> RPCRoute[In, Out]:
        @rpc_common(name, errors=errors, method=method)
        @functools.wraps(func)
        async def wrapper(req: ReqCommon[In]) -> Out | quart.Response:
            # 1. Authenticate the user.
            user, organization = await _check_session_auth()
            if not await _check_authorization(authorization, user, organization):
                raise UnauthorizedError
            logger.debug("request passed user authorization check")

            if organization:
                tag_current_span(organization_name=organization.name)
                tag_current_span(organization_id=organization.id)
            if user:
                tag_current_span(user_email=user.email)
                tag_current_span(user_id=user.id)

            # 2. Set up transaction.
            transaction = xact_customer(user.id, organization.id if authorization == "organization" and organization else None) if user else xact_admin()
            async with transaction as conn:
                req = ReqProduct(conn=conn, user=user, organization=organization, data=req.data, raw=req.raw)
                logger.info("entering request handler in rpc_product", has_user=user is None, has_organization=organization is None)
                rval = await func(req)
                logger.info("exited request handler in rpc_product")

            return rval

        return wrapper

    return decorator


async def _check_session_auth() -> tuple[UserModel | None, OrganizationModel | None]:
    """
    Check the current request's session authentication. If so, fetch the associated user
    and the organization they're logged in as.
    """
    session_external_id = quart.session.get(SESSION_ID_KEY, None)

    user = None
    organization = None

    logger.info(f"Session ID found in session: {session_external_id is not None}")
    if session_external_id:
        async with xact_admin() as conn:
            try:
                session = await query_rpc_unexpired_session_fetch(conn, id=session_external_id)
                logger.info("Session found: True")
                user = await query_user_fetch(conn, id=session.user_id)
                if session.organization_id is not None:
                    organization = await query_organization_fetch(conn, id=session.organization_id)
            except NotFoundError:
                logger.info("Session not found or expired")

    return user, organization


async def _check_authorization(authorization: Authorization, user: UserModel | None, organization: OrganizationModel | None) -> bool:
    """
    Validate that the user is authorized to submit a request this endpoint. For now, we
    only check the existence of a user, but this function can be expanded to RBAC
    systems or equivalents in the future.
    """
    if authorization == "public":
        return True
    if authorization == "user":
        return user is not None
    if authorization == "organization":
        return user is not None and organization is not None
    raise ImpossibleError("missed authorization type check in _check_authorization")  # pragma: no cover
