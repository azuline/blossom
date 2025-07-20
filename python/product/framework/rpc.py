"""
This module contains various helper functions, endpoint decorators, and
utilities for the web application package.
"""

import functools
from collections.abc import Awaitable, Callable
from dataclasses import dataclass, field
from typing import Any, Literal

import quart

from database.__codegen__ import models
from database.xact import DBQuerier, xact_admin, xact_customer
from foundation.errors import ImpossibleError
from foundation.logs import get_logger
from foundation.rpc import MethodEnum, ReqCommon, RPCError, RPCRoute, rpc_common
from foundation.span import tag_current_span

logger = get_logger()

SESSION_ID_KEY = "session_id"

Authorization = Literal[
    # Public means that anyone can access this endpoint.
    "public",
    # User means that any logged in user can access this endpoint, even if they are not authed with an
    # organization.
    "user",
    # Organization means that the requester must be authed with an organization.
    "organization",
]


@dataclass
class ReqProduct[In](ReqCommon[In]):
    q: DBQuerier
    user: models.User | None
    organization: models.Organization | None
    data: In


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
            transaction = xact_customer(user.id, organization.id if organization else None) if user else xact_admin()
            async with transaction as q:
                req = ReqProduct(q=q, user=user, organization=organization, data=req.data, raw=req.raw)
                logger.info("entering request handler in rpc_product", has_user=user is None, has_organization=organization is None)
                rval = await func(req)
                logger.info("exited request handler in rpc_product")
            return rval

        return wrapper

    return decorator


async def _check_session_auth() -> tuple[models.User | None, models.Organization | None]:
    """
    Check the current request's session authentication. If so, fetch the associated user
    and the organization they're logged in as.
    """
    session_external_id = quart.session.get(SESSION_ID_KEY, None)

    user = None
    organization = None

    logger.info(f"Session ID found in session: {session_external_id is not None}")
    if session_external_id:
        async with xact_admin() as q:
            session = await q.orm.rpc_unexpired_session_fetch(id=session_external_id)
            logger.info(f"Session found: {session is not None}")
            if session is not None:
                user = await q.orm.user_fetch(id=session.user_id)
                if session.organization_id is not None:
                    organization = await q.orm.organization_fetch(id=session.organization_id)

    return user, organization


async def _check_authorization(authorization: Authorization, user: models.User | None, organization: models.Organization | None) -> bool:
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
