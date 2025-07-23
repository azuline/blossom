import dataclasses

import quart
from werkzeug.security import check_password_hash

from foundation.webserver.rpc import RPCError
from product.framework.rpc import SESSION_ID_KEY, ReqProduct, rpc_product

BOGUS_PASSWORD_HASH = "pbkdf2:sha256:260000$HdBKH9zwdJpNsm8I$a0adb646f827525b478cc13db89e6ade694d2951987572edabf354b1821ae498"


@dataclasses.dataclass(slots=True)
class LoginIn:
    email: str
    password: str
    permanent: bool
    organization_id: str | None


@dataclasses.dataclass(slots=True)
class InvalidCredentialsError(RPCError):
    pass


@dataclasses.dataclass(slots=True)
class AuthOrganizationNotFoundError(RPCError):
    pass


@rpc_product("login", authorization="public", errors=[InvalidCredentialsError, AuthOrganizationNotFoundError])
async def login(req: ReqProduct[LoginIn]) -> None:
    """
    Log a user in if their credentials are correct.

    This function is ran with an admin database connection, which means there is no Row Level
    Security.
    """
    user = await req.q.orm.authn_user_fetch_by_email(email=req.data.email)

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

    # All sessions are tied to a organization. Unless a organization_external_id is explicitly passed in, the
    # session is tied to the most recently accessed organization.
    organization = None
    if req.data.organization_id is not None:
        organization = await req.q.orm.authn_linked_organization_fetch(user_id=user.id, id=req.data.organization_id)
        # If the passed in organization ID doesn't exist, raise an error.
        if organization is None:
            raise AuthOrganizationNotFoundError
    else:
        organization = await req.q.orm.authn_most_recently_accessed_organization_fetch(user_id=user.id)

    session = await req.q.orm.authn_session_create(user_id=user.id, organization_id=organization.id if organization else None)
    assert session is not None
    quart.session[SESSION_ID_KEY] = session.id
    quart.session.permanent = req.data.permanent
    return None


@rpc_product("logout", authorization="user", errors=[])
async def logout(req: ReqProduct[None]) -> None:
    """
    Expire the session cookie of the requesting user.

    As our cookies are HTTPOnly, clients cannot expire their own sessions. Thus, we must
    expose this endpoint.
    """
    session_id = quart.session[SESSION_ID_KEY]
    await req.q.orm.authn_session_expire(id=session_id)
    quart.session.clear()
    return None
