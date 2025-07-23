import contextlib
import dataclasses
from collections.abc import AsyncGenerator

from database.__codegen__.queries import AsyncQuerier
from database.conn import DBConn, DBConnPool, connect_db_admin, connect_db_customer
from foundation.logs import get_logger

logger = get_logger()


@dataclasses.dataclass(slots=True)
class DBQuerier:
    orm: AsyncQuerier
    conn: DBConn


@contextlib.asynccontextmanager
async def xact_admin(pg_pool: DBConnPool | None = None) -> AsyncGenerator[DBQuerier]:
    async with connect_db_admin(pg_pool=pg_pool, isolation_level="READ COMMITTED") as c:
        try:
            yield DBQuerier(orm=AsyncQuerier(c), conn=c)
            await c.commit()
        except Exception:
            await c.rollback()
            raise


@contextlib.asynccontextmanager
async def xact_customer(user_id: str, organization_id: str | None, pg_pool: DBConnPool | None = None) -> AsyncGenerator[DBQuerier]:
    async with connect_db_customer(user_id, organization_id, pg_pool=pg_pool, isolation_level="READ COMMITTED") as c:
        try:
            yield DBQuerier(orm=AsyncQuerier(c), conn=c)
            await c.commit()
        except Exception:
            await c.rollback()
            raise
