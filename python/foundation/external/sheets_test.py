from typing import cast

from foundation.external.external import EXT
from foundation.external.sheets import FakeGoogleSheetsService


def test_fake_google_sheets_service():
    """Test that the fake Google Sheets service works correctly."""
    # Access the fake service directly
    fake_service = cast(FakeGoogleSheetsService, EXT.sheets.service)

    # Set up test data
    fake_service.set_values("test-spreadsheet", "Sheet1!A1:B2", [["Name", "Value"], ["Test", "123"]])

    # Test get_values
    values = EXT.sheets.get_values("test-spreadsheet", "Sheet1!A1:B2")
    assert values == [["Name", "Value"], ["Test", "123"]]

    # Test that calls were tracked
    assert len(fake_service.calls) == 1
    assert fake_service.calls[0] == ("test-spreadsheet", "Sheet1!A1:B2")

    # Test batch_get_values
    fake_service.set_values("test-spreadsheet", "Sheet2!A1:A3", [["1"], ["2"], ["3"]])
    batch_result = EXT.sheets.batch_get_values("test-spreadsheet", ["Sheet1!A1:B2", "Sheet2!A1:A3"])

    assert batch_result == {
        "Sheet1!A1:B2": [["Name", "Value"], ["Test", "123"]],
        "Sheet2!A1:A3": [["1"], ["2"], ["3"]],
    }

    # Verify all calls were tracked
    assert len(fake_service.calls) == 3  # 1 from get_values + 2 from batch_get_values

    # Test clear functionality
    fake_service.clear()
    assert len(fake_service.calls) == 0
    assert len(fake_service.sheet_data) == 0


def test_fake_google_sheets_empty_data():
    """Test that the fake returns empty list when no data is set."""
    sheets_client = EXT.sheets
    fake_service = cast(FakeGoogleSheetsService, sheets_client.service)
    fake_service.clear()  # Ensure clean state

    # Should return empty list when no data exists
    values = sheets_client.get_values("nonexistent", "A1:B2")
    assert values == []


def test_get_sheet_id_mapping():
    """Test getting sheet name to gid mapping."""
    sheets_client = EXT.sheets
    fake_service = cast(FakeGoogleSheetsService, sheets_client.service)
    fake_service.clear()

    # Set up data for multiple sheets
    fake_service.set_values("test-spreadsheet", "Sales!A1:B2", [["Product", "Revenue"], ["Widget", "1000"]])
    fake_service.set_values("test-spreadsheet", "'Monthly Report'!C1:C3", [["100"], ["200"], ["300"]])
    fake_service.set_values("test-spreadsheet", "Summary!D1", [["Total"]])

    # Get sheet ID mapping
    sheet_mapping = sheets_client.get_sheet_id_mapping("test-spreadsheet")

    assert sheet_mapping == {
        "Sales": 0,
        "Monthly Report": 1,
        "Summary": 2,
    }

    # Test with no data
    fake_service.clear()
    sheet_mapping = sheets_client.get_sheet_id_mapping("empty-spreadsheet")
    assert sheet_mapping == {"Sheet1": 0}  # Default sheet
