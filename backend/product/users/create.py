from werkzeug.security import generate_password_hash

from codegen.sqlc.models import UserSignupStep
from foundation.config import confvars
from foundation.database import conn_admin, create_pg_pool


async def create_user(*, email: str, name: str, password: str | None) -> None:
    password_hash = generate_password_hash(password) if password else None

    async with await create_pg_pool(confvars.psycopg_database_url) as pg_pool:
        async with conn_admin(pg_pool) as cq:
            await cq.q.user_create(
                name=name,
                email=email,
                password_hash=password_hash,
                signup_step=UserSignupStep.COMPLETE if password_hash else UserSignupStep.CREATED,
            )
