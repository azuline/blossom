import contextlib
import dataclasses
from collections.abc import AsyncGenerator

from foundation.logs import get_logger
from sqlalchemy.ext.asyncio import AsyncConnection

from database.access.access import DBConnPool, connection
from database.codegen.queries import AsyncQuerier

logger = get_logger()


@dataclasses.dataclass
class DBQuerier:
    orm: AsyncQuerier
    conn: AsyncConnection


@contextlib.asynccontextmanager
async def xact(pool: DBConnPool | None = None) -> AsyncGenerator[DBQuerier]:
    async with connection(pool=pool) as c:
        try:
            yield DBQuerier(orm=AsyncQuerier(c), conn=c)
            await c.commit()
        except Exception:
            await c.rollback()
            raise
