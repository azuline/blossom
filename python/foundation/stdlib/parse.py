from collections.abc import Callable, Sequence
from typing import Any

import pydantic

from foundation.observability.errors import BaseError
from foundation.stdlib.decorators import memoize


def parse_dataclass[T](dc: type[T] | Any, data: dict[str, Any]) -> T:
    # Accept Any because `type[T]` doesn't work for annotated unions.
    validator = make_pydantic_validator(dc)
    return validator(data)


class NotADataclassError(BaseError):
    pass


@memoize
def make_pydantic_validator[T](dc: type[T]) -> Callable[[Any], T]:
    # Requirement: dc should be a dataclass or union of dataclasses.
    return pydantic.TypeAdapter(dc).validate_python


def parse_dataclass_list[T](dc: type[T] | Any, data: Sequence[dict[str, Any]]) -> list[T]:
    return [parse_dataclass(dc, item) for item in data]
