from dataclasses import dataclass

import quart
from werkzeug.security import check_password_hash

from foundation.rpc.error import APIError
from foundation.rpc.route import SESSION_ID_KEY, Req, route

BOGUS_PASSWORD_HASH = "pbkdf2:sha256:260000$HdBKH9zwdJpNsm8I$a0adb646f827525b478cc13db89e6ade694d2951987572edabf354b1821ae498"


@dataclass
class LoginIn:
    email: str
    password: str
    permanent: bool
    tenant_external_id: str | None


@dataclass
class InvalidCredentialsError(APIError):
    pass


@dataclass
class AuthTenantNotFoundError(APIError):
    pass


@route(authorization="public", errors=[InvalidCredentialsError, AuthTenantNotFoundError])
async def login(req: Req[LoginIn]) -> None:
    """
    Log a user in if their credentials are correct.

    This function is ran with an admin database connection, which means there is no Row Level
    Security.
    """
    user = await req.cq.q.authn_fetch_user_email(email=req.data.email)

    # Fail auth if:
    # 1. No user with this email exists
    # 2. The user has not completed signup
    # 3. The specified password is incorrect
    # Fail auth at the start of the function to avoid any timing side channels.
    if not user or not user.password_hash:
        # Spin some cycles so that we take the same time for no user & no password. This prevents
        # information leak via timing side channel.
        check_password_hash(BOGUS_PASSWORD_HASH, "garbage")
        raise InvalidCredentialsError
    if not check_password_hash(user.password_hash, req.data.password):
        raise InvalidCredentialsError

    # All sessions are tied to a tenant. Unless a tenant_external_id is explicitly passed in, the
    # session is tied to the most recently accessed tenant.
    tenant = None
    if req.data.tenant_external_id is not None:
        tenant = await req.cq.q.authn_fetch_linked_tenant(
            user_id=user.id,
            external_id=req.data.tenant_external_id,
        )
        # If the passed in tenant ID doesn't exist, raise an error.
        if tenant is None:
            raise AuthTenantNotFoundError
    else:
        tenant = await req.cq.q.authn_fetch_most_recently_accessed_tenant(user_id=user.id)

    session = await req.cq.q.authn_create_session(
        user_id=user.id,
        tenant_id=tenant.id if tenant else None,
    )
    assert session is not None
    quart.session[SESSION_ID_KEY] = session.external_id
    quart.session.permanent = req.data.permanent
    return None


@route(authorization="user", errors=[])
async def logout(req: Req[None]) -> None:
    """
    Expire the session cookie of the requesting user.

    As our cookies are HTTPOnly, clients cannot expire their own sessions. Thus, we must
    expose this endpoint.
    """
    session_external_id = quart.session[SESSION_ID_KEY]
    await req.cq.q.authn_expire_session(external_id=session_external_id)
    quart.session.clear()
    return None
