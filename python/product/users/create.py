from werkzeug.security import generate_password_hash

from database.__codegen_db__.models import UserModel
from database.conn import DBConn
from product.users.__codegen_db__.queries import query_user_create


async def user_create(*, conn: DBConn, email: str, name: str, password: str | None) -> UserModel:
    password_hash = generate_password_hash(password) if password else None
    signup_step = "complete" if password_hash else "created"
    return await query_user_create(conn, name=name, email=email, password_hash=password_hash, signup_step=signup_step)
