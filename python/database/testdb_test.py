from database.conn import connect_db_admin
from database.testdb import TestDB


async def test_testdb():
    testdb = TestDB()

    db1 = await testdb.create_db()
    db2 = await testdb.create_db()
    assert db1 != db2

    async with connect_db_admin() as conn:
        cursor = await conn.execute("SELECT datname FROM pg_database WHERE datname = ANY(%s)", ([db1, db2],))
        db_names = [r[0] async for r in cursor]
        assert len(db_names) == 2

    await testdb.drop_db(db1)
    await testdb.drop_db(db2)

    async with connect_db_admin() as conn:
        cursor = await conn.execute("SELECT datname FROM pg_database WHERE datname = ANY(%s)", ([db1, db2],))
        db_names = [r[0] async for r in cursor]
        assert len(db_names) == 0
