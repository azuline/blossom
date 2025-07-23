import asyncio
import contextlib
import re
from collections.abc import AsyncIterator

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncConnection, AsyncEngine, create_async_engine

from foundation.env import ENV
from foundation.observability.logs import get_logger
from foundation.stdlib.jsonenc import dump_json_pg, load_json_pg
from foundation.stdlib.tasks import create_unsupervised_task

logger = get_logger()

DBConn = AsyncConnection
DBConnPool = AsyncEngine

USER_ID_SAFETY_REGEX = re.compile(r"usr_[A-Za-z0-9]+$")
ORGANIZATION_ID_SAFETY_REGEX = re.compile(r"org_[A-Za-z0-9]+$")


async def create_pg_pool(
    database_uri: str | None = None,
    *,
    TESTING_min_size: int | None = None,
    TESTING_max_size: int | None = None,
) -> DBConnPool:
    min_size = TESTING_min_size or ENV.database_pool_min_size
    max_size = TESTING_max_size or ENV.database_pool_max_size
    return create_async_engine(
        url=(database_uri or ENV.database_uri).replace("postgresql://", "postgresql+psycopg://"),
        echo=ENV.testing,
        pool_size=min_size,
        max_overflow=max_size - min_size,
        pool_pre_ping=True,
        pool_recycle=300,  # 5 minutes
        connect_args={"connect_timeout": 3},
        json_deserializer=load_json_pg,
        json_serializer=dump_json_pg,
    )


_cached_db_uri: str = ENV.database_uri
_cached_db_pool: DBConnPool | None = None
_cached_db_event_loop: asyncio.AbstractEventLoop | None = None


async def _default_pool() -> DBConnPool:
    # Create a default global connection pool for the application. Support cache invalidation on the
    # DB URI and event loop for testing (these don't usually change in production).
    global _cached_db_pool, _cached_db_uri, _cached_db_event_loop
    loop = asyncio.get_running_loop()
    if not _cached_db_pool or ENV.database_uri != _cached_db_uri or _cached_db_event_loop != loop:
        if _cached_db_pool:
            create_unsupervised_task("cached_pg_pool_cleanup", _cached_db_pool.dispose)
        _cached_db_pool = await create_pg_pool()
        _cached_db_uri = ENV.database_uri
        _cached_db_event_loop = loop
    return _cached_db_pool


@contextlib.asynccontextmanager
async def connect_db_admin(*, pg_pool: DBConnPool | None = None, isolation_level: str = "AUTOCOMMIT") -> AsyncIterator[DBConn]:
    pg_pool = pg_pool or await _default_pool()
    async with pg_pool.connect() as conn:
        conn = await conn.execution_options(isolation_level=isolation_level)
        await _unset_row_level_security(conn)
        yield conn


@contextlib.asynccontextmanager
async def connect_db_customer(user_id: str, organization_id: str | None, *, pg_pool: DBConnPool | None = None, isolation_level: str = "AUTOCOMMIT") -> AsyncIterator[DBConn]:
    pg_pool = pg_pool or await _default_pool()
    async with pg_pool.execution_options(isolation_level=isolation_level).connect() as conn:
        await _set_row_level_security(conn, user_id, organization_id)
        yield conn


async def _unset_row_level_security(conn: DBConn) -> None:
    """Reset connection to clean state."""
    await conn.execute(text("SET ROLE postgres; RESET app.current_user_id; RESET app.current_organization_id;"))


async def _set_row_level_security(conn: DBConn, user_id: str, organization_id: str | None) -> None:
    # Protect against SQL injection this way.
    assert USER_ID_SAFETY_REGEX.match(user_id)
    assert not organization_id or ORGANIZATION_ID_SAFETY_REGEX.match(organization_id)

    # Execute multiple SET commands in a single statement for efficiency
    if organization_id:
        await conn.execute(text(f"SET ROLE customer; SET app.current_user_id = '{user_id}'; SET app.current_organization_id = '{organization_id}';"))
    else:
        await conn.execute(text(f"SET ROLE customer; SET app.current_user_id = '{user_id}'; RESET app.current_organization_id;"))
