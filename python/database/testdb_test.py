from sqlalchemy import text

from database.conn import connect_db_admin
from database.testdb import TestDB
from foundation.logs import get_logger

logger = get_logger()


async def test_testdb():
    testdb = TestDB()

    db1 = await testdb.create_db()
    db2 = await testdb.create_db()
    assert db1 != db2

    async with connect_db_admin() as conn:
        result = await conn.execute(text("SELECT datname FROM pg_database WHERE datname = ANY(:names)"), {"names": [db1, db2]})
        db_names = [r[0] for r in result]
        assert len(db_names) == 2

    await testdb.drop_db(db1)
    await testdb.drop_db(db2)

    async with connect_db_admin() as conn:
        result = await conn.execute(text("SELECT datname FROM pg_database WHERE datname = ANY(:names)"), {"names": [db1, db2]})
        db_names = [r[0] for r in result]
        assert len(db_names) == 0
