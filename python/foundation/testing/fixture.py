from __future__ import annotations

import dataclasses

from foundation.testing.errors import TestErrors
from foundation.testing.factory import TestFactory
from foundation.testing.rpc import TestRPC


@dataclasses.dataclass
class TFix:
    """Big object that contains all our optional testing fixtures and utilities."""

    factory: TestFactory
    errors: TestErrors
    rpc: TestRPC

    @classmethod
    def create(cls) -> TFix:
        t = cls(
            factory=TestFactory(),
            errors=TestErrors(),
            rpc=None,  # type: ignore
        )
        t.rpc = TestRPC(t)
        return t
