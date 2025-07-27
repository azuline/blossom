import secrets

from sqlalchemy import text

from database.__codegen_db__.queries import TestBulkInsertsData, query_test_bulk_inserts
from database.xact import xact_admin


async def test_bulk_inserts() -> None:
    """Test the query_test_bulk_inserts function by inserting three rows and verifying they exist."""
    # Generate random organization names to avoid conflicts with existing data
    org_names = [
        f"test_org_{secrets.token_hex(8)}",
        f"test_org_{secrets.token_hex(8)}",
        f"test_org_{secrets.token_hex(8)}",
    ]
    
    # Prepare test data
    test_data = [
        TestBulkInsertsData(name=org_names[0], inbound_source="organic"),
        TestBulkInsertsData(name=org_names[1], inbound_source="referral"),
        TestBulkInsertsData(name=org_names[2], inbound_source="outreach"),
    ]

    async with xact_admin() as conn:
        # Execute bulk insert using the generated ORM function
        await query_test_bulk_inserts(conn, test_data)

        # Verify the specific rows exist by querying for our random names
        cursor = await conn.execute(
            text("SELECT name, inbound_source FROM organizations WHERE name = ANY(:names)"),
            {"names": org_names}
        )
        rows = cursor.fetchall()

        assert len(rows) == 3
        # Use sets for comparison
        expected = {(name, source) for name, source in zip(org_names, ["organic", "referral", "outreach"])}
        actual = set(rows)
        assert actual == expected

