import datetime
import json
from dataclasses import dataclass

from foundation.jsonenc import PostgresJSONDecoder, PostgresJSONEncoder, dump_json_pg


def test_postgres_json_decoder_datetime():
    decoder = PostgresJSONDecoder()

    # Test datetime decoding
    timestamp_json = '{"__sentinel": "timestamp", "value": "2021-07-27T16:02:08.070557"}'
    result = decoder.decode(timestamp_json)
    assert isinstance(result, datetime.datetime)
    assert result == datetime.datetime(2021, 7, 27, 16, 2, 8, 70557, tzinfo=datetime.UTC)

    # Test bytes input
    timestamp_bytes = timestamp_json.encode("utf-8")
    result_bytes = decoder.decode(timestamp_bytes)  # type: ignore
    assert result_bytes == result


def test_postgres_json_decoder_date():
    decoder = PostgresJSONDecoder()

    # Test date decoding
    date_json = '{"__sentinel": "date", "value": "2021-07-27"}'
    result = decoder.decode(date_json)
    assert isinstance(result, datetime.date)
    assert result == datetime.date(2021, 7, 27)


def test_postgres_json_decoder_regular_object():
    decoder = PostgresJSONDecoder()

    # Test that regular objects pass through unchanged
    regular_json = '{"name": "test", "value": 123}'
    result = decoder.decode(regular_json)
    assert result == {"name": "test", "value": 123}


def test_postgres_json_encoder_datetime_date():
    encoder = PostgresJSONEncoder()

    # Test datetime encoding
    dt = datetime.datetime(2021, 7, 27, 16, 2, 8, 70557, tzinfo=datetime.UTC)
    dt_json = encoder.encode(dt)
    expected_dt = '{"__sentinel": "timestamp", "value": "2021-07-27T16:02:08.070557"}'
    assert json.loads(dt_json) == json.loads(expected_dt)

    # Test date encoding
    d = datetime.date(2021, 7, 27)
    d_json = encoder.encode(d)
    expected_d = '{"__sentinel": "date", "value": "2021-07-27"}'
    assert json.loads(d_json) == json.loads(expected_d)


def test_postgres_json_encoder_dataclass():
    @dataclass
    class Person:
        name: str
        age: int
        created_at: datetime.datetime

    encoder = PostgresJSONEncoder()

    person = Person(name="Alice", age=30, created_at=datetime.datetime(2021, 7, 27, 16, 2, 8, tzinfo=datetime.UTC))
    result = encoder.encode(person)

    # The encoder should convert the dataclass to dict and handle the datetime
    expected = {"name": "Alice", "age": 30, "created_at": {"__sentinel": "timestamp", "value": "2021-07-27T16:02:08"}}
    assert json.loads(result) == expected


def test_serialize_json_pg_with_dataclass():
    @dataclass
    class Event:
        event_type: str
        occurred_at: datetime.datetime
        details: dict

    event = Event(event_type="user_login", occurred_at=datetime.datetime(2021, 7, 27, 16, 2, 8, tzinfo=datetime.UTC), details={"user_id": 123})

    result = dump_json_pg(event)
    parsed = json.loads(result)

    assert parsed["event_type"] == "user_login"
    assert parsed["occurred_at"] == {"__sentinel": "timestamp", "value": "2021-07-27T16:02:08"}
    assert parsed["details"] == {"user_id": 123}


def test_roundtrip_datetime_date():
    # Test full roundtrip for datetime
    original_dt = datetime.datetime(2021, 7, 27, 16, 2, 8, 70557, tzinfo=datetime.UTC)
    encoded = json.dumps(original_dt, cls=PostgresJSONEncoder)
    decoded = json.loads(encoded, cls=PostgresJSONDecoder)
    assert decoded == original_dt

    # Test full roundtrip for date
    original_date = datetime.date(2021, 7, 27)
    encoded = json.dumps(original_date, cls=PostgresJSONEncoder)
    decoded = json.loads(encoded, cls=PostgresJSONDecoder)
    assert decoded == original_date

