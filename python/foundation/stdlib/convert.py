import re
from typing import Any, Literal, TypeAliasType, get_args, get_origin


def int_to_bytes(x: int) -> bytes:
    return x.to_bytes((x.bit_length() + 7) // 8, "big")


def snake_case_to_pascal_case(s: str) -> str:
    return "".join([x.title() for x in s.split("_")])


MARKDOWN_LINK_REGEX = re.compile(r"\[([^\]]+)\]\((https://[^\)]+)\)")


def markdown_to_slack_markup(text: str) -> str:
    replacements: list[tuple[str, str]] = []
    for m in MARKDOWN_LINK_REGEX.finditer(text):
        replacements.append((m[0], f"<{m[2]}|{m[1]}>"))
    for src, dst in replacements:
        text = text.replace(src, dst)
    return text


def cast_notnull[T](x: T | None) -> T:
    assert x is not None
    return x


def enum_type_to_values(x: Any) -> list[str]:
    """Given a Literal type or type alias of strings, return all the values."""
    while isinstance(x, TypeAliasType):
        x = x.__value__
    if get_origin(x) is Literal:
        return list(get_args(x))
    raise TypeError(f"{x} is not a Literal[...]")
