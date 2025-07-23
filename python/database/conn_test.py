from sqlalchemy import text

from database.conn import connect_db_admin, connect_db_customer, create_pg_pool
from database.testdb import TestDB
from foundation.env import ENV
from foundation.stdlib.types import cast_notnull


async def test_connection_pool_reuses_connections() -> None:
    pg_pool = await create_pg_pool(ENV.database_uri, TESTING_min_size=1, TESTING_max_size=1)
    try:
        pids_seen = set()
        for _ in range(10):
            async with pg_pool.connect() as conn:
                cursor = await conn.execute(text("SELECT pg_backend_pid()"))
                row = cursor.first()
                assert row
                pids_seen.add(row[0])

        assert len(pids_seen) == 1, f"too many unique PIDs ({len(pids_seen)}), expected 1: {pids_seen=}"
        assert "Pool size: 1" in pg_pool.pool.status()
    finally:
        await pg_pool.dispose()


async def test_row_level_security_in_connection_pool() -> None:
    """This test checks whether the connections cycled through the pool respect Row Level Security."""
    testdb = TestDB()
    db_uri = testdb.database_uri(await testdb.create_db())
    pg_pool = await create_pg_pool(db_uri, TESTING_min_size=1, TESTING_max_size=1)

    try:
        async with connect_db_admin(pg_pool=pg_pool) as conn:
            await conn.execute(text("INSERT INTO organizations (name, inbound_source) VALUES ('minji', 'organic')"))
            await conn.execute(text("INSERT INTO organizations (name, inbound_source) VALUES ('dani', 'organic')"))
            cursor = await conn.execute(text("INSERT INTO organizations (name, inbound_source) VALUES ('hanni', 'organic') RETURNING id"))
            org_m = cursor.first()
            assert org_m is not None
            organization_id = org_m[0]

            cursor = await conn.execute(text("INSERT INTO users (name, email) VALUES ('pham', 'pham@sunsetglow.net') RETURNING id"))
            user_m = cursor.first()
            assert user_m is not None
            user_id = user_m[0]

            await conn.execute(text("INSERT INTO organizations_users (user_id, organization_id) VALUES (:p1, :p2)"), {"p1": user_id, "p2": organization_id})

            cursor = await conn.execute(text("SELECT pg_backend_pid()"))
            connection_pid = cast_notnull(cursor.first())[0]

        # Test that when connections cycle back through the pool and get reused. the Row Level
        # Security is respected.
        for _ in range(10):
            async with connect_db_admin(pg_pool=pg_pool) as conn:
                cursor = await conn.execute(text("SELECT name FROM organizations"))
                assert {r[0] for r in cursor} == {"minji", "dani", "hanni"}
                assert cast_notnull((await conn.execute(text("SELECT pg_backend_pid()"))).first())[0] == connection_pid
            async with connect_db_customer(user_id, organization_id, pg_pool=pg_pool) as conn:
                cursor = await conn.execute(text("SELECT name FROM organizations"))
                assert {r[0] for r in cursor} == {"hanni"}
                assert cast_notnull((await conn.execute(text("SELECT pg_backend_pid()"))).first())[0] == connection_pid
    finally:
        await pg_pool.dispose()
