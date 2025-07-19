from sqlalchemy import text

from database.access.access import connection
from foundation.testing.testdb import TestDB


async def test_testdb():
    testdb = TestDB()

    db1 = await testdb.create_db()
    db2 = await testdb.create_db()
    assert db1 != db2

    async with connection() as conn:
        result = await conn.execute(text("SELECT datname FROM pg_database WHERE datname = ANY(:db_names)"), {"db_names": [db1, db2]})
        db_names = result.scalars().all()
        assert len(db_names) == 2

    await testdb.drop_db(db1)
    await testdb.drop_db(db2)

    async with connection() as conn:
        result = await conn.execute(text("SELECT datname FROM pg_database WHERE datname = ANY(:db_names)"), {"db_names": [db1, db2]})
        db_names = result.scalars().all()
        assert len(db_names) == 0


async def test_db_names_are_random():
    # Use a dummy URI for testing TestDB functionality
    testdb = TestDB()

    # Create multiple databases and verify they all have unique random names
    db_names = []
    for _ in range(3):
        db_name = await testdb.create_db()
        assert db_name.startswith("test_")
        assert len(db_name) == 21  # "test_" (5) + 16 hex chars
        db_names.append(db_name)

    # Verify all names are unique
    assert len(set(db_names)) == 3

    # Clean up
    for db_name in db_names:
        await testdb.drop_db(db_name)
