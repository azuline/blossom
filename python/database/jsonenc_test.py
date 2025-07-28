import dataclasses
import datetime

import pytest

from database.conn import dump_json_pg, load_json_pg
from database.jsonenc import JsonInjectionError
from foundation.stdlib.parse import parse_dataclass


def test_postgres_json_serde():
    @dataclasses.dataclass(slots=True)
    class Nested:
        test_dict: dict

    @dataclasses.dataclass(slots=True)
    class Event:
        test_str: str
        test_datetime: datetime.datetime
        test_date: datetime.date
        test_nested: Nested

    raw = Event(
        test_str="user_login",
        test_datetime=datetime.datetime(2021, 7, 27, 16, 2, 8, tzinfo=datetime.UTC),
        test_date=datetime.date(2021, 7, 27),
        test_nested=Nested(test_dict={"user_id": 123}),
    )

    encoded = dump_json_pg(raw)
    decoded = load_json_pg(encoded)

    assert parse_dataclass(Event, decoded) == raw

    # Test for injection
    with pytest.raises(JsonInjectionError):
        encoded = dump_json_pg({"fake_sentinel_to_cause_crash": {"__sentinel": "date", "value": "lalala"}})
