"""Convert dataclasses to JSON schemas."""

import dataclasses
import types
from typing import Any, Literal, Union, get_args, get_origin, get_type_hints

from openai.types.shared_params.response_format_json_schema import ResponseFormatJSONSchema


def dataclass_to_jsonschema(dc: type, name: str) -> ResponseFormatJSONSchema:
    return {"type": "json_schema", "json_schema": {"name": name, "schema": _convert_dataclass(dc), "strict": True}}


def _convert_dataclass(dc: type) -> dict[str, Any]:
    if not dataclasses.is_dataclass(dc):
        raise ValueError(f"{dc} is not a dataclass")

    schema = {"type": "object", "properties": {}, "required": [], "additionalProperties": False}
    hints = get_type_hints(dc)
    for field in dataclasses.fields(dc):
        field_schema = _convert_type(hints[field.name])
        if field.metadata.get("description"):
            field_schema["description"] = field.metadata["description"]
        schema["properties"][field.name] = field_schema  # type: ignore
        schema["required"].append(field.name)  # type: ignore
    return schema


def _convert_type(py_type: type) -> dict[str, Any]:
    """Convert a Python type to a JSON schema."""
    if py_type is str:
        return {"type": "string"}
    elif py_type is int:
        return {"type": "integer"}
    elif py_type is float:
        return {"type": "number"}
    elif py_type is bool:
        return {"type": "boolean"}
    elif py_type is type(None):
        return {"type": "null"}

    origin = get_origin(py_type)
    args = get_args(py_type)

    if origin is Literal:
        return {"type": "string", "enum": list(args)}
    if origin is Union or origin is types.UnionType:
        return {"anyOf": [_convert_type(t) for t in args]}
    if origin is list:
        return {"type": "array", "items": _convert_type(args[0]) if args else {}}
    if origin is dict:
        return {"type": "object", "additionalProperties": _convert_type(args[1]) if len(args) >= 2 else {}}
    if dataclasses.is_dataclass(py_type):
        return _convert_dataclass(py_type)
    if py_type is Any:
        return {}
    raise NotImplementedError(f"{py_type} cannot be converted into JSONSchema")
