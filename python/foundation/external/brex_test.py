import pytest

from foundation.external.brex import CBrex, FakeBrexClient


@pytest.mark.asyncio
async def test_fake_brex_expenses():
    """Test the fake Brex client for expenses."""
    fake_client = FakeBrexClient()
    brex = CBrex(_fake_client=fake_client)

    fake_client.TEST_add_expense({"id": "exp1", "amount": 100})
    fake_client.TEST_add_expense({"id": "exp2", "amount": 200})

    pages = []
    async for page in brex.get_expenses([]):
        pages.append(page)

    assert len(pages) == 1
    assert len(pages[0]) == 2
    assert pages[0][0]["id"] == "exp1"
    assert pages[0][1]["id"] == "exp2"


@pytest.mark.asyncio
async def test_fake_brex_vendors():
    """Test the fake Brex client for vendors."""
    fake_client = FakeBrexClient()
    brex = CBrex(_fake_client=fake_client)

    fake_client.TEST_add_vendor({"id": "ven1", "company_name": "Vendor 1"})
    fake_client.TEST_add_vendor({"id": "ven2", "company_name": "Vendor 2"})

    pages = []
    async for page in brex.get_vendors():
        pages.append(page)

    assert len(pages) == 1
    assert len(pages[0]) == 2
    assert pages[0][0]["id"] == "ven1"
    assert pages[0][1]["id"] == "ven2"


@pytest.mark.asyncio
async def test_fake_brex_pagination():
    """Test pagination in fake Brex client."""
    fake_client = FakeBrexClient()
    brex = CBrex(_fake_client=fake_client)

    for i in range(1500):
        fake_client.TEST_add_expense({"id": f"exp{i}", "amount": i})

    pages = []
    total_items = 0
    async for page in brex.get_expenses([]):
        pages.append(page)
        total_items += len(page)

    assert len(pages) == 2
    assert len(pages[0]) == 1000
    assert len(pages[1]) == 0
    assert total_items == 1000


@pytest.mark.asyncio
async def test_expenses_with_filters():
    """Test expenses with filters."""
    fake_client = FakeBrexClient()
    brex = CBrex(_fake_client=fake_client)

    fake_client.TEST_add_expense({"id": "exp1", "expense_type": "CARD"})
    fake_client.TEST_add_expense({"id": "exp2", "expense_type": "REIMBURSEMENT"})

    filters = [("expense_type[]", "CARD"), ("status[]", "APPROVED")]

    pages = []
    async for page in brex.get_expenses(filters):
        pages.append(page)

    assert len(pages) == 1
    assert len(pages[0]) == 2


@pytest.mark.asyncio
async def test_empty_results():
    """Test behavior with no data."""
    fake_client = FakeBrexClient()
    brex = CBrex(_fake_client=fake_client)

    expense_pages = []
    async for page in brex.get_expenses([]):
        expense_pages.append(page)

    assert len(expense_pages) == 1
    assert len(expense_pages[0]) == 0

    vendor_pages = []
    async for page in brex.get_vendors():
        vendor_pages.append(page)

    assert len(vendor_pages) == 1
    assert len(vendor_pages[0]) == 0
