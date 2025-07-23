import asyncio

from sqlalchemy import text
from sqlalchemy.exc import ProgrammingError

from database.conn import DBConn, _set_row_level_security, create_pg_pool
from database.testdb import TestDB
from foundation.env import ENV
from foundation.identifiers import generate_id


async def test_row_level_security_in_connection_pool() -> None:
    """
    This test checks whether the Connection Pool is correctly scrubbing app.current_user_id and
    app.current_organization_id from the connections in the pool upon their return into the pool.
    """
    testdb = TestDB()
    db_uri = testdb.database_uri(await testdb.create_db())
    user_id = generate_id("usr")

    async def get_user_id(c: DBConn) -> str | None:
        try:
            result = await c.execute(text("SHOW app.current_user_id"))
        except ProgrammingError:
            return None
        row = result.first()
        if not row or not row[0]:
            return None
        return row[0]

    pg_pool = await create_pg_pool(db_uri)
    try:
        connections: list[DBConn] = []

        async def create_conn(rls: bool) -> DBConn:
            c = await pg_pool.connect().__aenter__()
            if rls:
                # Fake user with a fake ID.
                await _set_row_level_security(c, user_id, None)
            connections.append(c)
            return c

        async def destroy_conn(c: DBConn) -> None:
            await c.close()
            connections.remove(c)

        # Spin up MAX_SIZE conns and give them all a user ID.
        for _ in range(ENV.database_pool_max_size):
            await create_conn(True)

        # Check that they all have a user ID.
        for c in connections:
            assert await get_user_id(c) == user_id

        # Setup tasks that create new connections. These connections wait for a released connection
        # from the pool. Do not give these connections a user ID; this way they would re-use the old
        # user ID if improperly configured.
        ctasks = []
        existing_conns = [*connections]
        for _ in range(ENV.database_pool_max_size):
            ctasks.append(asyncio.create_task(create_conn(False)))

        # Give the coroutines time to make their connection requests
        await asyncio.sleep(0.2)

        # Check that we have pending connection requests
        assert len(ctasks) == ENV.database_pool_max_size, "test misconfigured: connection tasks not created"

        # Destroy existing connections.
        for c in existing_conns:
            await destroy_conn(c)

        # Await the connection creations and assert the new connection has the correct user ID.
        results = await asyncio.gather(*ctasks, return_exceptions=True)
        for r in results:
            assert not isinstance(r, BaseException)
            # The reset handler should have cleaned up the user_id
            assert await get_user_id(r) is None

        # Cleanup; destroy all connections.
        for c in [*connections]:
            await destroy_conn(c)
    finally:
        await pg_pool.dispose()
