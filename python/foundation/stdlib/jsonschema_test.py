import dataclasses
from typing import Any, Literal

from foundation.stdlib.jsonschema import dataclass_to_jsonschema


@dataclasses.dataclass
class Inner:
    name: str
    value: int = 42


@dataclasses.dataclass
class Outer:
    # Basic types
    text: str
    number: int
    decimal: float
    flag: bool
    # Optional
    maybe_text: str | None
    # Literal (enum)
    status: Literal["active", "inactive", "pending"]
    # Collections
    tags: list[str]
    metadata: dict[str, Any]
    # Nested object in array in object
    items: list[Inner]
    # Field with description
    email: str = dataclasses.field(metadata={"description": "User email address"})


def test_comprehensive():
    schema = dataclass_to_jsonschema(Outer, "test_response")
    expected = {
        "type": "json_schema",
        "json_schema": {
            "name": "test_response",
            "schema": {
                "type": "object",
                "additionalProperties": False,
                "required": ["text", "number", "decimal", "flag", "maybe_text", "status", "tags", "metadata", "items", "email"],
                "properties": {
                    "text": {"type": "string"},
                    "number": {"type": "integer"},
                    "decimal": {"type": "number"},
                    "flag": {"type": "boolean"},
                    "maybe_text": {"anyOf": [{"type": "string"}, {"type": "null"}]},
                    "status": {"type": "string", "enum": ["active", "inactive", "pending"]},
                    "tags": {"type": "array", "items": {"type": "string"}},
                    "metadata": {"type": "object", "additionalProperties": {}},
                    "items": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "additionalProperties": False,
                            "required": ["name", "value"],
                            "properties": {"name": {"type": "string"}, "value": {"type": "integer"}},
                        },
                    },
                    "email": {"type": "string", "description": "User email address"},
                },
            },
            "strict": True,
        },
    }
    assert schema == expected
