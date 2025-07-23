import asyncio

from sqlalchemy import text

from database.conn import _set_row_level_security, create_pg_pool
from foundation.env import ENV


async def test_connection_pool_reuses_connections() -> None:
    pg_pool = await create_pg_pool(ENV.database_uri, TESTING_min_size=1, TESTING_max_size=1)
    try:
        pids_seen = set()
        num_uses = 10
        for _ in range(num_uses):
            async with pg_pool.connect() as conn:
                result = await conn.execute(text("SELECT pg_backend_pid()"))
                row = result.first()
                assert row
                pids_seen.add(row[0])
            # Small delay to let pool settle
            await asyncio.sleep(0.01)

        # With a max pool size of 1 and 10 uses, we should see only 1 unique PID
        assert len(pids_seen) == 1, f"too many unique PIDs ({len(pids_seen)}), expected 1: {pids_seen=}"
        # Check pool size using SQLAlchemy API
        pool_status = pg_pool.pool.status()
        # pool_status format: "Pool size: X  Connections in pool: Y Current Overflow: Z Current Checked out connections: W"
        assert "Pool size: 1" in pool_status
    finally:
        await pg_pool.dispose()


async def test_pool_cycles_row_level_security_without_error() -> None:
    pg_pool = await create_pg_pool(ENV.database_uri, TESTING_min_size=1, TESTING_max_size=1)
    try:
        # Create some connections with RLS and some without RLS.
        async with pg_pool.connect() as conn:
            result = await conn.execute(text("SELECT 1"))
            assert result.scalar() == 1

        async with pg_pool.connect() as conn:
            await _set_row_level_security(conn, "usr_test", "org_test")
            result = await conn.execute(text("SELECT 1"))
            assert result.scalar() == 1

        async with pg_pool.connect() as conn:
            result = await conn.execute(text("SELECT 1"))
            assert result.scalar() == 1

        for _ in range(3):
            async with pg_pool.connect() as conn:
                # Set row level security on each connection
                await _set_row_level_security(conn, "usr_test", "org_test")
                result = await conn.execute(text("SELECT 1"))
                assert result.scalar() == 1

        # Check pool size using SQLAlchemy API
        pool_status = pg_pool.pool.status()
        # pool_status format: "Pool size: X  Connections in pool: Y Current Overflow: Z Current Checked out connections: W"
        assert "Pool size: 1" in pool_status
    finally:
        await pg_pool.dispose()
