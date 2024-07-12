import logging
import sys
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from dataclasses import dataclass
from typing import Any

from psycopg import AsyncConnection
from psycopg.sql import SQL, Identifier
from psycopg_pool import AsyncConnectionPool, AsyncNullConnectionPool

from codegen.sqlc.models import Tenant, User
from codegen.sqlc.queries import AsyncQuerier
from foundation.config import CONFVARS

# Type aliases for everyone.
Conn = AsyncConnection[Any]
# Unsure why I'm getting type errors if it's only AsyncNullConnectionPool.
ConnPool = AsyncNullConnectionPool | AsyncConnectionPool


@dataclass
class ConnQuerier:
    c: Conn
    q: AsyncQuerier


async def create_pg_pool(url: str) -> ConnPool:
    return AsyncNullConnectionPool(
        conninfo=url,
        max_size=CONFVARS.pool_size,
        # We turn autocommit on so that by default, queries can run outside of
        # a transaction. When a connection desires to run a series of queries
        # in a single transaction, they can explicitly start a transaction with BEGIN.
        kwargs={"autocommit": True},
        reset=clean_up_row_level_security,
        timeout=3,
    )


if "pytest" in sys.modules:  # pragma: no cover
    logging.getLogger("psycopg").setLevel(logging.DEBUG)
    logging.getLogger("psycopg.pool").setLevel(logging.DEBUG)


@asynccontextmanager
async def conn_admin(pg_pool: ConnPool) -> AsyncIterator[ConnQuerier]:
    async with pg_pool.connection() as conn:
        yield ConnQuerier(c=conn, q=AsyncQuerier(conn))


@asynccontextmanager
async def conn_cust(
    pg_pool: ConnPool,
    user: User | None,
    tenant: Tenant | None,
) -> AsyncIterator[ConnQuerier]:
    async with pg_pool.connection() as conn:
        await set_row_level_security(conn, user, tenant)
        yield ConnQuerier(c=conn, q=AsyncQuerier(conn))


async def set_row_level_security(
    conn: Conn,
    user: User | None,
    tenant: Tenant | None,
) -> None:
    # A pipeline runs all the following commands in sequence without waiting for the previous
    # roundtrip to finish. Since we aren't reading the results, this is more performant.
    async with conn.pipeline():
        # We need to make sure that this role is unset at the end of the connection. We do
        # this in the create_pg_pool function, where all connections are cleaned up by
        # calling SET ROLE postgres.
        #
        # We do this with the reset function of the conn pool.
        await conn.execute("SET ROLE customer")

        if user and isinstance(user.id, int):
            # nosemgrep
            await conn.execute(SQL("SET app.current_user_id = {}").format(Identifier(str(user.id))))
        else:
            await conn.execute("RESET app.current_user_id")

        if tenant and isinstance(tenant.id, int):
            await conn.execute(
                # nosemgrep
                SQL("SET app.current_tenant_id = {}").format(Identifier(str(tenant.id)))
            )
        else:
            await conn.execute("RESET app.current_tenant_id")


async def clean_up_row_level_security(conn: Conn) -> None:
    # A pipeline runs all the following commands in sequence without waiting for the previous
    # roundtrip to finish. Since we aren't reading the results, this is more performant.
    async with conn.pipeline():
        await conn.execute("SET ROLE postgres")
        await conn.execute("RESET app.current_user_id")
        await conn.execute("RESET app.current_tenant_id")
