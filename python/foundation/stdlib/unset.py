from typing import Any

from pydantic_core import CoreSchema, core_schema


class Unset:
    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type: Any, _handler: Any) -> CoreSchema:
        return core_schema.none_schema()


UNSET = Unset()
