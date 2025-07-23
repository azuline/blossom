from __future__ import annotations

import dataclasses
import json
from typing import Any

from google.oauth2 import service_account
from googleapiclient.discovery import build

from foundation.env import ENV
from foundation.observability.errors import ConfigurationError


class CSheets:
    """Google Sheets client wrapper."""

    def __init__(self, *, _fake_service: FakeGoogleSheetsService | None = None):
        if _fake_service:
            self.service = _fake_service
        else:
            if ENV.google_sheets_credentials_json is None:
                raise ConfigurationError("GOOGLE_SHEETS_CREDENTIALS_JSON is not set")
            self.service = build(
                "sheets",
                "v4",
                credentials=service_account.Credentials.from_service_account_info(
                    json.loads(ENV.google_sheets_credentials_json),
                    scopes=["https://www.googleapis.com/auth/spreadsheets"],
                ),
            )

    def get_values(self, spreadsheet_id: str, range_name: str) -> list[list[Any]]:
        """Fetch values from a Google Sheets spreadsheet.

        Args:
            spreadsheet_id: The ID of the spreadsheet (from the URL)
            range_name: The A1 notation of the range to retrieve

        Returns:
            A 2D list of values from the spreadsheet
        """
        result = self.service.spreadsheets().values().get(spreadsheetId=spreadsheet_id, range=range_name).execute()
        return result.get("values", [])

    def batch_get_values(self, spreadsheet_id: str, ranges: list[str]) -> dict[str, list[list[Any]]]:
        """Fetch multiple ranges from a Google Sheets spreadsheet.

        Args:
            spreadsheet_id: The ID of the spreadsheet (from the URL)
            ranges: List of A1 notation ranges to retrieve

        Returns:
            A dictionary mapping range names to their values
        """
        result = self.service.spreadsheets().values().batchGet(spreadsheetId=spreadsheet_id, ranges=ranges).execute()
        return {value_range["range"]: value_range.get("values", []) for value_range in result.get("valueRanges", [])}

    def get_sheet_id_mapping(self, spreadsheet_id: str) -> dict[str, int]:
        """Get a mapping of sheet names to their gids (sheet IDs).

        Args:
            spreadsheet_id: The ID of the spreadsheet (from the URL)

        Returns:
            A dictionary mapping sheet names to their gids
        """
        spreadsheet = self.service.spreadsheets().get(spreadsheetId=spreadsheet_id).execute()
        return {sheet["properties"]["title"]: sheet["properties"]["sheetId"] for sheet in spreadsheet.get("sheets", [])}

    def clear_values(self, spreadsheet_id: str, range_name: str) -> dict[str, Any]:
        """Clear values from a Google Sheets range.

        Args:
            spreadsheet_id: The ID of the spreadsheet (from the URL)
            range_name: The A1 notation of the range to clear

        Returns:
            The API response
        """
        result = self.service.spreadsheets().values().clear(spreadsheetId=spreadsheet_id, range=range_name, body={}).execute()
        return result

    def update_values(self, spreadsheet_id: str, range_name: str, values: list[list[Any]], value_input_option: str = "RAW") -> dict[str, Any]:
        """Update values in a Google Sheets range.

        Args:
            spreadsheet_id: The ID of the spreadsheet (from the URL)
            range_name: The A1 notation of the range to update
            values: The values to write
            value_input_option: How the input data should be interpreted (RAW or USER_ENTERED)

        Returns:
            The API response
        """
        body = {"values": values}
        result = self.service.spreadsheets().values().update(spreadsheetId=spreadsheet_id, range=range_name, valueInputOption=value_input_option, body=body).execute()
        return result


@dataclasses.dataclass(slots=True)
class FakeSheetData:
    """Represents fake data for a sheet range."""

    range: str
    values: list[list[Any]]


class FakeValuesResource:
    """Fake implementation of Google Sheets values resource."""

    def __init__(self, parent: FakeGoogleSheetsService):
        self.parent = parent

    def get(self, spreadsheetId: str, range: str):
        """Return a fake get request object."""
        return FakeGetRequest(self.parent, spreadsheetId, range)

    def batchGet(self, spreadsheetId: str, ranges: list[str]):
        """Return a fake batch get request object."""
        return FakeBatchGetRequest(self.parent, spreadsheetId, ranges)

    def clear(self, spreadsheetId: str, range: str, body: dict):  # noqa: ARG002
        """Return a fake clear request object."""
        return FakeClearRequest(self.parent, spreadsheetId, range)

    def update(self, spreadsheetId: str, range: str, valueInputOption: str, body: dict):  # noqa: ARG002
        """Return a fake update request object."""
        return FakeUpdateRequest(self.parent, spreadsheetId, range, body.get("values", []))


class FakeGetRequest:
    """Fake implementation of a get request."""

    def __init__(self, service: FakeGoogleSheetsService, spreadsheet_id: str, range_name: str):
        self.service = service
        self.spreadsheet_id = spreadsheet_id
        self.range_name = range_name

    def execute(self) -> dict[str, Any]:
        """Execute the fake get request."""
        self.service.calls.append((self.spreadsheet_id, self.range_name))

        if self.spreadsheet_id in self.service.sheet_data:
            for data in self.service.sheet_data[self.spreadsheet_id]:
                if data.range == self.range_name:
                    return {"values": data.values}

        return {"values": []}


class FakeBatchGetRequest:
    """Fake implementation of a batch get request."""

    def __init__(self, service: FakeGoogleSheetsService, spreadsheet_id: str, ranges: list[str]):
        self.service = service
        self.spreadsheet_id = spreadsheet_id
        self.ranges = ranges

    def execute(self) -> dict[str, Any]:
        """Execute the fake batch get request."""
        value_ranges = []
        for range_name in self.ranges:
            self.service.calls.append((self.spreadsheet_id, range_name))
            values = []

            if self.spreadsheet_id in self.service.sheet_data:
                for data in self.service.sheet_data[self.spreadsheet_id]:
                    if data.range == range_name:
                        values = data.values
                        break

            value_ranges.append({"range": range_name, "values": values})

        return {"valueRanges": value_ranges}


class FakeClearRequest:
    """Fake implementation of a clear request."""

    def __init__(self, service: FakeGoogleSheetsService, spreadsheet_id: str, range_name: str):
        self.service = service
        self.spreadsheet_id = spreadsheet_id
        self.range_name = range_name

    def execute(self) -> dict[str, Any]:
        """Execute the fake clear request."""
        if self.spreadsheet_id in self.service.sheet_data:
            # Remove data for this range
            self.service.sheet_data[self.spreadsheet_id] = [d for d in self.service.sheet_data[self.spreadsheet_id] if not d.range.startswith(self.range_name.split("!")[0])]
        return {"clearedRange": self.range_name}


class FakeUpdateRequest:
    """Fake implementation of an update request."""

    def __init__(self, service: FakeGoogleSheetsService, spreadsheet_id: str, range_name: str, values: list[list[Any]]):
        self.service = service
        self.spreadsheet_id = spreadsheet_id
        self.range_name = range_name
        self.values = values

    def execute(self) -> dict[str, Any]:
        """Execute the fake update request."""
        self.service.set_values(self.spreadsheet_id, self.range_name, self.values)
        return {
            "updatedRange": self.range_name,
            "updatedRows": len(self.values),
            "updatedColumns": len(self.values[0]) if self.values else 0,
            "updatedCells": sum(len(row) for row in self.values),
        }


class FakeSpreadsheetGetRequest:
    """Fake implementation of a spreadsheet metadata get request."""

    def __init__(self, service: FakeGoogleSheetsService, spreadsheet_id: str):
        self.service = service
        self.spreadsheet_id = spreadsheet_id

    def execute(self) -> dict[str, Any]:
        """Execute the fake get request for spreadsheet metadata."""
        # Return fake sheet metadata
        sheets = []
        sheet_id = 0

        # Add sheets based on what data we have
        if self.spreadsheet_id in self.service.sheet_data:
            seen_sheets = set()
            for data in self.service.sheet_data[self.spreadsheet_id]:
                # Extract sheet name from range (e.g., "Sheet1!A1:B2" -> "Sheet1")
                sheet_name = data.range.split("!")[0].strip("'")
                if sheet_name not in seen_sheets:
                    sheets.append({
                        "properties": {
                            "sheetId": sheet_id,
                            "title": sheet_name,
                            "index": sheet_id,
                        }
                    })
                    seen_sheets.add(sheet_name)
                    sheet_id += 1

        # Always include a default sheet if no data
        if not sheets:
            sheets.append({
                "properties": {
                    "sheetId": 0,
                    "title": "Sheet1",
                    "index": 0,
                }
            })

        return {"sheets": sheets}


class FakeSpreadsheetsResource:
    """Fake implementation of Google Sheets spreadsheets resource."""

    def __init__(self, parent: FakeGoogleSheetsService):
        self.parent = parent

    def values(self):
        """Return fake values resource."""
        return FakeValuesResource(self.parent)

    def get(self, spreadsheetId: str):
        """Return a fake get request for spreadsheet metadata."""
        return FakeSpreadsheetGetRequest(self.parent, spreadsheetId)


class FakeGoogleSheetsService:
    """Fake Google Sheets service that mimics the real API structure."""

    def __init__(self):
        self.sheet_data: dict[str, list[FakeSheetData]] = {}
        self.calls: list[tuple[str, str]] = []  # Track (spreadsheet_id, range) calls

    def spreadsheets(self):
        """Return fake spreadsheets resource."""
        return FakeSpreadsheetsResource(self)

    def set_values(self, spreadsheet_id: str, range_name: str, values: list[list[Any]]):
        """Set fake values for a specific spreadsheet and range."""
        if spreadsheet_id not in self.sheet_data:
            self.sheet_data[spreadsheet_id] = []

        # Remove any existing data for this range
        self.sheet_data[spreadsheet_id] = [d for d in self.sheet_data[spreadsheet_id] if d.range != range_name]

        self.sheet_data[spreadsheet_id].append(FakeSheetData(range=range_name, values=values))

    def clear(self):
        """Clear all fake data and call history."""
        self.sheet_data.clear()
        self.calls.clear()
