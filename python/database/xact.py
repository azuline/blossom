import contextlib
import dataclasses
from collections.abc import AsyncGenerator

from database.__codegen_db__.queries import AsyncQuerier
from database.conn import DBConn, DBConnPool, connect_db_admin, connect_db_customer
from foundation.observability.logs import get_logger
from foundation.observability.metrics import metric_increment

logger = get_logger()


@contextlib.asynccontextmanager
async def xact_admin(pg_pool: DBConnPool | None = None) -> AsyncGenerator[DBConn]:
    async with connect_db_admin(pg_pool=pg_pool, isolation_level="READ COMMITTED") as conn:
        try:
            yield conn
            await conn.commit()
            metric_increment("database.xact", success=True, role="admin")
        except Exception:
            await conn.rollback()
            metric_increment("database.xact", success=False, role="admin")
            raise


@contextlib.asynccontextmanager
async def xact_customer(user_id: str, organization_id: str | None, pg_pool: DBConnPool | None = None) -> AsyncGenerator[DBConn]:
    async with connect_db_customer(user_id, organization_id, pg_pool=pg_pool, isolation_level="READ COMMITTED") as conn:
        try:
            yield conn
            await conn.commit()
            metric_increment("database.xact", success=True, role="customer")
        except Exception:
            await conn.rollback()
            metric_increment("database.xact", success=False, role="customer")
            raise
