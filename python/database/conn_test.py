from sqlalchemy import text

from database.conn import create_pg_pool
from foundation.env import ENV


async def test_connection_pool_reuses_connections() -> None:
    pg_pool = await create_pg_pool(ENV.database_uri, TESTING_min_size=1, TESTING_max_size=1)
    try:
        pids_seen = set()
        for _ in range(10):
            async with pg_pool.connect() as conn:
                result = await conn.execute(text("SELECT pg_backend_pid()"))
                row = result.first()
                assert row
                pids_seen.add(row[0])

        assert len(pids_seen) == 1, f"too many unique PIDs ({len(pids_seen)}), expected 1: {pids_seen=}"
        assert "Pool size: 1" in pg_pool.pool.status()
    finally:
        await pg_pool.dispose()
