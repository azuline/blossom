import secrets

from sqlalchemy import text

from database.__codegen_db__.queries import (
    TestBatchCreateUsersData,
    TestBatchUpdateUserVisitedData,
    TestBatchUpsertOrganizationsData,
    TestBulkInsertsData,
    query_test_batch_create_users,
    query_test_batch_update_user_visited,
    query_test_batch_upsert_organizations,
    query_test_bulk_inserts,
)
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
        cursor = await conn.execute(text("SELECT name, inbound_source FROM organizations WHERE name = ANY(:names)"), {"names": org_names})
        rows = cursor.fetchall()

        assert len(rows) == 3
        # Use sets for comparison
        expected = {(name, source) for name, source in zip(org_names, ["organic", "referral", "outreach"], strict=False)}
        actual = set(rows)
        assert actual == expected


async def test_batch_upsert_organizations() -> None:
    """Test the query_test_batch_upsert_organizations function with conflict resolution."""
    # Generate unique organization IDs and names
    org_ids = [
        f"org_{secrets.token_hex(8)}",
        f"org_{secrets.token_hex(8)}",
        f"org_{secrets.token_hex(8)}",
    ]
    org_names = [
        f"test_upsert_org_{secrets.token_hex(8)}",
        f"test_upsert_org_{secrets.token_hex(8)}",
        f"test_upsert_org_{secrets.token_hex(8)}",
    ]

    # First batch: initial insert
    initial_data = [
        TestBatchUpsertOrganizationsData(id=org_ids[0], name=org_names[0], inbound_source="organic"),
        TestBatchUpsertOrganizationsData(id=org_ids[1], name=org_names[1], inbound_source="referral"),
        TestBatchUpsertOrganizationsData(id=org_ids[2], name=org_names[2], inbound_source="outreach"),
    ]

    # Second batch: update existing records (conflict resolution using same IDs)
    update_data = [
        TestBatchUpsertOrganizationsData(id=org_ids[0], name=org_names[0], inbound_source="word_of_mouth"),
        TestBatchUpsertOrganizationsData(id=org_ids[1], name=org_names[1], inbound_source="unknown"),
        TestBatchUpsertOrganizationsData(id=org_ids[2], name=org_names[2], inbound_source="organic"),
    ]

    async with xact_admin() as conn:
        # First batch insert
        await query_test_batch_upsert_organizations(conn, initial_data)

        # Verify initial insert
        cursor = await conn.execute(text("SELECT id, inbound_source FROM organizations WHERE id = ANY(:ids)"), {"ids": org_ids})
        rows = cursor.fetchall()
        assert len(rows) == 3
        initial_expected = {(org_id, source) for org_id, source in zip(org_ids, ["organic", "referral", "outreach"], strict=False)}
        assert set(rows) == initial_expected

        # Second batch: upsert (should update existing records)
        await query_test_batch_upsert_organizations(conn, update_data)

        # Verify upsert updated the records
        cursor = await conn.execute(text("SELECT id, inbound_source FROM organizations WHERE id = ANY(:ids)"), {"ids": org_ids})
        rows = cursor.fetchall()
        assert len(rows) == 3  # Same number of rows
        updated_expected = {(org_id, source) for org_id, source in zip(org_ids, ["word_of_mouth", "unknown", "organic"], strict=False)}
        assert set(rows) == updated_expected


async def test_batch_create_users() -> None:
    """Test the query_test_batch_create_users function (:batchone - each query returns exactly one user)."""
    # Generate unique user data - each input creates exactly one user
    user_data = [
        TestBatchCreateUsersData(name=f"unique_user_{secrets.token_hex(8)}", email=f"unique_{secrets.token_hex(8)}@example.com"),
        TestBatchCreateUsersData(name=f"unique_user_{secrets.token_hex(8)}", email=f"unique_{secrets.token_hex(8)}@example.com"),
        TestBatchCreateUsersData(name=f"unique_user_{secrets.token_hex(8)}", email=f"unique_{secrets.token_hex(8)}@example.com"),
    ]

    async with xact_admin() as conn:
        # Execute batch create and collect results - :batchone guarantees one result per input
        created_users = []
        async for user in query_test_batch_create_users(conn, user_data):
            created_users.append(user)

        # Verify we got exactly one result for each input (:batchone semantics)
        assert len(created_users) == 3

        # Verify each user has the expected data and unique ID
        created_emails = {user.email for user in created_users}
        expected_emails = {user.email for user in user_data}
        assert created_emails == expected_emails

        created_names = {user.name for user in created_users}
        expected_names = {user.name for user in user_data}
        assert created_names == expected_names

        # Verify all users have unique IDs (generated by database)
        created_ids = {user.id for user in created_users}
        assert len(created_ids) == 3  # All IDs should be unique
        for user in created_users:
            assert user.id.startswith("usr_")  # Based on schema convention


async def test_batch_update_user_visited() -> None:
    """Test the query_test_batch_update_user_visited function (:batchmany - single query can return multiple users with same name)."""
    # Create users with overlapping names to demonstrate :batchmany semantics
    shared_names = [f"shared_name_{secrets.token_hex(4)}", f"shared_name_{secrets.token_hex(4)}"]

    user_data = [
        # Multiple users with same name to test :batchmany
        TestBatchCreateUsersData(name=shared_names[0], email=f"user1_{secrets.token_hex(6)}@example.com"),
        TestBatchCreateUsersData(name=shared_names[0], email=f"user2_{secrets.token_hex(6)}@example.com"),
        TestBatchCreateUsersData(name=shared_names[1], email=f"user3_{secrets.token_hex(6)}@example.com"),
        TestBatchCreateUsersData(name=shared_names[1], email=f"user4_{secrets.token_hex(6)}@example.com"),
        TestBatchCreateUsersData(name=shared_names[1], email=f"user5_{secrets.token_hex(6)}@example.com"),
    ]

    async with xact_admin() as conn:
        # Create users first
        created_users = []
        async for user in query_test_batch_create_users(conn, user_data):
            created_users.append(user)

        assert len(created_users) == 5

        # Prepare batch update data - only 2 unique names, but should update 5 users
        update_data = [TestBatchUpdateUserVisitedData(name=name) for name in shared_names]

        # Execute batch update - :batchmany means each query can return multiple results
        updated_users = []
        async for user in query_test_batch_update_user_visited(conn, update_data):
            updated_users.append(user)

        # Verify we got more results than input queries (:batchmany semantics)
        # 2 queries, but 5 users updated (2 with first name, 3 with second name)
        assert len(updated_users) == 5

        # Verify all users now have last_visited_at set
        for user in updated_users:
            assert user.last_visited_at is not None
            assert user.id.startswith("usr_")

        # Verify the user IDs match our created users
        updated_user_ids = {user.id for user in updated_users}
        expected_user_ids = {user.id for user in created_users}
        assert updated_user_ids == expected_user_ids

        # Verify names match our shared names
        updated_names = {user.name for user in updated_users}
        assert updated_names == set(shared_names)
