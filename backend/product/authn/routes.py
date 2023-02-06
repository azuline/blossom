from dataclasses import dataclass

import quart
from werkzeug.security import check_password_hash

from codegen.sqlc.queries import AsyncQuerier
from foundation.db import conn_admin
from foundation.rpc.error import APIError
from foundation.rpc.route import SESSION_USER_ID_KEY, Req, route


@dataclass
class LoginIn:
    email: str
    password: str
    permanent: bool


@dataclass
class InvalidCredentialsError(APIError):
    pass


@route(
    name="Login",
    authorization="public",
    in_=LoginIn,
    out=None,
    errors=[InvalidCredentialsError],
)
async def login(req: Req[LoginIn]) -> None:
    """
    Log a user in if their credentials are correct.
    """
    # To read arbitrary users, connect as admin.
    async with conn_admin(pg_pool=req.pg_pool) as conn:
        q = AsyncQuerier(conn)
        user = await q.authn_fetch_user_email(email=req.data.email)

    # 1. If no user with this email exists
    # 2. If the user has not completed signup
    # 3. If the specified password is incorrect
    if (
        not user
        or not user.password_hash
        or not check_password_hash(user.password_hash, req.data.password)
    ):
        raise InvalidCredentialsError()

    quart.session[SESSION_USER_ID_KEY] = user.external_id
    quart.session.permanent = req.data.permanent
    return None


@route(name="Logout", in_=None, out=None, errors=[], authorization="user")
async def logout(_: Req[None]) -> None:
    """
    Expire the session cookie of the requesting user.

    As our cookies are HTTPOnly, clients cannot expire their own sessions. Thus, we must
    expose this endpoint.
    """
    quart.session.clear()
    return None
