import asyncio
import contextlib
import logging
import re
import sys
from collections.abc import AsyncIterator
from typing import Any, cast

import psycopg
from psycopg import AsyncConnection
from psycopg.sql import SQL, Identifier
from psycopg_pool import AsyncNullConnectionPool

from foundation.env import ENV

# Type aliases for everyone.
DBConn = AsyncConnection[Any]
# Unsure why I'm getting type errors if it's only AsyncNullConnectionPool.
DBConnPool = AsyncNullConnectionPool

USER_ID_SAFETY_REGEX = re.compile(r"usr_[A-Za-z0-9]+$")
ORGANIZATION_ID_SAFETY_REGEX = re.compile(r"org_[A-Za-z0-9]+$")


async def create_pg_pool(database_uri: str | None = None) -> DBConnPool:
    pool = AsyncNullConnectionPool(
        conninfo=database_uri or ENV.database_uri,
        max_size=ENV.database_pool_size,
        open=False,
        # We turn autocommit on so that by default, queries can run outside of
        # a transaction. When a connection desires to run a series of queries
        # in a single transaction, they can explicitly start a transaction with BEGIN.
        kwargs={"autocommit": True},
        reset=_clean_up_row_level_security,
        timeout=3,
    )
    await pool.open()
    return cast(DBConnPool, pool)


if "pytest" in sys.modules:  # pragma: no cover
    logging.getLogger("psycopg").setLevel(logging.DEBUG)  # noqa: TID251
    logging.getLogger("psycopg.pool").setLevel(logging.DEBUG)  # noqa: TID251


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
            await _cached_db_pool.close()
        _cached_db_pool = await create_pg_pool()
        _cached_db_uri = ENV.database_uri
        _cached_db_event_loop = loop
    return _cached_db_pool


@contextlib.asynccontextmanager
async def connect_db_admin(pg_pool: DBConnPool | None = None) -> AsyncIterator[DBConn]:
    pg_pool = pg_pool or await _default_pool()
    async with pg_pool.connection() as conn:
        yield conn


@contextlib.asynccontextmanager
async def connect_db_admin_nopool() -> AsyncIterator[DBConn]:
    async with await psycopg.AsyncConnection.connect(ENV.database_uri, autocommit=True) as conn:
        yield conn


@contextlib.asynccontextmanager
async def connect_db_customer(user_id: str, organization_id: str | None, pg_pool: DBConnPool | None = None) -> AsyncIterator[DBConn]:
    pg_pool = pg_pool or await _default_pool()
    async with pg_pool.connection() as conn:
        await _set_row_level_security(conn, user_id, organization_id)
        yield conn


async def _set_row_level_security(conn: DBConn, user_id: str, organization_id: str | None) -> None:
    # Protect against SQL injection this way.
    assert USER_ID_SAFETY_REGEX.match(user_id)
    assert not organization_id or ORGANIZATION_ID_SAFETY_REGEX.match(organization_id)

    # A pipeline runs all the following commands in sequence without waiting for the previous
    # roundtrip to finish. Since we aren't reading the results, this is more performant.
    async with conn.pipeline():
        # We need to make sure that this role is unset at the end of the connection. We do
        # this in the create_pg_pool function, where all connections are cleaned up by
        # calling SET ROLE postgres.
        #
        # We do this with the reset function of the conn pool.
        await conn.execute("SET ROLE customer")

        await conn.execute(SQL("SET app.current_user_id = {}").format(Identifier(str(user_id))))
        if organization_id:
            await conn.execute(SQL("SET app.current_organization_id = {}").format(Identifier(str(organization_id))))


async def _clean_up_row_level_security(conn: DBConn) -> None:
    # A pipeline runs all the following commands in sequence without waiting for the previous
    # roundtrip to finish. Since we aren't reading the results, this is more performant.
    async with conn.pipeline():
        await conn.execute("SET ROLE postgres")
        await conn.execute("RESET app.current_user_id")
        await conn.execute("RESET app.current_organization_id")
