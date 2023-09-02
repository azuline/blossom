from dataclasses import asdict, dataclass
from typing import Any


@dataclass
class APIError(Exception):
    def __init__(self) -> None:
        self.message = self.__class__.__name__

    def serialize(self) -> dict[str, Any]:
        return {
            "error": self.__class__.__name__,
            "data": asdict(self),
        }
