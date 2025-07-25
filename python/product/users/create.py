from werkzeug.security import generate_password_hash

from database.__codegen__ import models
from database.xact import DBQuerier
from foundation.stdlib.convert import cast_notnull


async def user_create(*, q: DBQuerier, email: str, name: str, password: str | None) -> models.User:
    password_hash = generate_password_hash(password) if password else None
    signup_step = "complete" if password_hash else "created"
    return cast_notnull(await q.orm.user_create(name=name, email=email, password_hash=password_hash, signup_step=signup_step))
