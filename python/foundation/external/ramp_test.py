import pytest

from foundation.external.external import EXT
from foundation.external.ramp import FakeRampClient


@pytest.fixture(autouse=True)
def reset_fake_ramp_client():
    """Reset the fake Ramp client before each test."""
    fake_client = EXT.ramp.client
    assert isinstance(fake_client, FakeRampClient), "Ramp client should be fake in tests"
    fake_client.TEST_reset()
    yield
    fake_client.TEST_reset()


async def test_get_departments():
    """Test the get_departments method."""
    fake_client = EXT.ramp.client
    assert isinstance(fake_client, FakeRampClient)

    # Add test departments
    fake_client.TEST_add_department({
        "id": "dept_123",
        "name": "Engineering",
        "code": "ENG",
        "is_active": True,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
    })

    fake_client.TEST_add_department({
        "id": "dept_456",
        "name": "Marketing",
        "code": "MKT",
        "is_active": True,
        "created_at": "2024-01-02T00:00:00Z",
        "updated_at": "2024-01-02T00:00:00Z",
    })

    fake_client.TEST_add_department({
        "id": "dept_789",
        "name": "Sales",
        "code": "SLS",
        "is_active": False,
        "created_at": "2024-01-03T00:00:00Z",
        "updated_at": "2024-01-03T00:00:00Z",
    })

    # Test authentication
    token = await EXT.ramp.authenticate("test-id", "test-secret")
    assert token == "fake-ramp-token-123"

    # Test getting departments
    departments = []
    async for page in EXT.ramp.get_departments(token, []):
        departments.extend(page.items)

    assert len(departments) == 3
    assert departments[0]["id"] == "dept_123"
    assert departments[0]["name"] == "Engineering"
    assert departments[0]["code"] == "ENG"
    assert departments[0]["is_active"] is True

    assert departments[1]["id"] == "dept_456"
    assert departments[1]["name"] == "Marketing"
    assert departments[1]["code"] == "MKT"
    assert departments[1]["is_active"] is True

    assert departments[2]["id"] == "dept_789"
    assert departments[2]["name"] == "Sales"
    assert departments[2]["code"] == "SLS"
    assert departments[2]["is_active"] is False


async def test_get_departments_many():
    """Test get_departments with many departments."""
    fake_client = EXT.ramp.client
    assert isinstance(fake_client, FakeRampClient)

    # Add multiple departments
    departments_data = []
    for i in range(10):
        dept = {
            "id": f"dept_{i:03d}",
            "name": f"Department {i}",
            "code": f"D{i:03d}",
            "is_active": i % 2 == 0,  # Alternate active/inactive
        }
        departments_data.append(dept)
        fake_client.TEST_add_department(dept)

    token = await EXT.ramp.authenticate("test-id", "test-secret")

    # Get all departments
    all_departments = []
    async for page in EXT.ramp.get_departments(token, []):
        all_departments.extend(page.items)

    # Verify all departments were returned
    assert len(all_departments) == 10

    # Verify they're in the order they were added
    for i, dept in enumerate(all_departments):
        assert dept["id"] == f"dept_{i:03d}"
        assert dept["name"] == f"Department {i}"
        assert dept["code"] == f"D{i:03d}"
        assert dept["is_active"] == (i % 2 == 0)


async def test_get_departments_empty():
    """Test get_departments with no departments."""
    token = await EXT.ramp.authenticate("test-id", "test-secret")

    departments = []
    async for page in EXT.ramp.get_departments(token, []):
        departments.extend(page.items)

    assert len(departments) == 0


async def test_get_users():
    """Test the get_users method."""
    fake_client = EXT.ramp.client
    assert isinstance(fake_client, FakeRampClient)

    # Add test users
    fake_client.TEST_add_user({
        "id": "user_123",
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "department_id": "dept_123",
        "is_active": True,
    })

    fake_client.TEST_add_user({
        "id": "user_456",
        "first_name": "Jane",
        "last_name": "Smith",
        "email": "jane.smith@example.com",
        "department_id": "dept_456",
        "is_active": True,
    })

    fake_client.TEST_add_user({
        "id": "user_789",
        "first_name": "Bob",
        "last_name": "Johnson",
        "email": "bob.johnson@example.com",
        "department_id": None,
        "is_active": False,
    })

    # Test authentication
    token = await EXT.ramp.authenticate("test-id", "test-secret")
    assert token == "fake-ramp-token-123"

    # Test getting users
    users = []
    async for page in EXT.ramp.get_users(token, []):
        users.extend(page.items)

    assert len(users) == 3
    assert users[0]["id"] == "user_123"
    assert users[0]["first_name"] == "John"
    assert users[0]["last_name"] == "Doe"
    assert users[0]["department_id"] == "dept_123"

    assert users[1]["id"] == "user_456"
    assert users[1]["first_name"] == "Jane"
    assert users[1]["last_name"] == "Smith"
    assert users[1]["department_id"] == "dept_456"

    assert users[2]["id"] == "user_789"
    assert users[2]["first_name"] == "Bob"
    assert users[2]["last_name"] == "Johnson"
    assert users[2]["department_id"] is None
    assert users[2]["is_active"] is False
