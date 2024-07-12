import asyncio
from dataclasses import dataclass

import psycopg

from foundation.config import CONFVARS
from foundation.database import Conn, create_pg_pool, set_row_level_security
from foundation.test.db import run_database_migrations


@dataclass
class FakeUser:
    id: int  # noqa: A003


async def test_row_level_security_in_connection_pool(isolated_db: str) -> None:
    """
    This test checks whether the Connection Pool is correctly scrubbing app.current_user_id and
    app.current_tenant_id from the connections in the pool upon their return into the pool.
    """

    run_database_migrations(CONFVARS.database_url + "/" + isolated_db)

    async def get_user_id(c: Conn) -> int | None:
        try:
            cur = await c.execute("SHOW app.current_user_id")
        except psycopg.errors.UndefinedObject:
            return None
        row = await cur.fetchone()
        if not row or not row[0]:
            return None
        return int(row[0])

    async with await create_pg_pool(CONFVARS.database_url + "/" + isolated_db) as pg_pool:
        connections: list[Conn] = []

        async def create_conn(rls: bool) -> Conn:
            c = await pg_pool.getconn(timeout=5)
            if rls:
                # Fake user with a fake ID.
                await set_row_level_security(c, FakeUser(id=1), None)  # type: ignore
            connections.append(c)
            return c

        async def destroy_conn(c: Conn) -> None:
            await pg_pool.putconn(c)
            connections.remove(c)

        # Spin up MAX_SIZE conns and give them all a user ID.
        for _ in range(CONFVARS.pool_size):
            await create_conn(True)

        # Check that they all have a user ID.
        for c in connections:
            assert await get_user_id(c) == 1

        # Setup tasks that create new connections. These connections wait for a released connection
        # from the pool. Do not give these connections a user ID; this way they would re-use the old
        # user ID if improperly configured.
        ctasks = []
        existing_conns = [*connections]
        for _ in range(CONFVARS.pool_size):
            ctasks.append(asyncio.create_task(create_conn(False)))

        # Give the coroutines time to make their getconn requests. Assert that the getconn requests
        # have been made. This is necessary for a NullPool, since a NullPool only re-uses
        # connections if there are pending connection requests.
        await asyncio.sleep(0.2)
        assert (
            pg_pool.get_stats()["requests_waiting"] == CONFVARS.pool_size
        ), "Test misconfigured: async sleep too short: getconn requests not yet made."

        # Destroy existing connections.
        for c in existing_conns:
            await destroy_conn(c)

        # Await the connection creations and assert the new connection has the correct user ID.
        results = await asyncio.gather(*ctasks, return_exceptions=True)
        for r in results:
            assert not isinstance(r, BaseException)
            assert await get_user_id(r) is None

        # Cleanup; destroy all connections.
        for c in [*connections]:
            await destroy_conn(c)
