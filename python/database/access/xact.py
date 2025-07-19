import contextlib
import dataclasses
from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncConnection

from database.access.conn import DBConnPool, connect_db_admin
from database.codegen.queries import AsyncQuerier
from foundation.logs import get_logger

logger = get_logger()


@dataclasses.dataclass
class DBQuerier:
    orm: AsyncQuerier
    conn: AsyncConnection


@contextlib.asynccontextmanager
async def xact_admin(pg_pool: DBConnPool | None = None) -> AsyncGenerator[DBQuerier]:
    async with connect_db_admin(pg_pool=pg_pool) as c:
        try:
            yield DBQuerier(orm=AsyncQuerier(c), conn=c)
            await c.commit()
        except Exception:
            await c.rollback()
            raise
