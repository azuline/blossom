from werkzeug.security import generate_password_hash

from codegen.sqlc.models import User, UserSignupStep
from foundation.database import ConnQuerier


async def user_create(*, cq: ConnQuerier, email: str, name: str, password: str | None) -> User:
    password_hash = generate_password_hash(password) if password else None
    user = await cq.q.user_create(
        name=name,
        email=email,
        password_hash=password_hash,
        signup_step=UserSignupStep.COMPLETE if password_hash else UserSignupStep.CREATED,
    )
    assert user is not None
    return user
