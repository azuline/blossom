from __future__ import annotations

import dataclasses

import pytest

from foundation.rpc import RPCRouter
from foundation.testing.errors import TestErrors
from foundation.testing.factory import TestFactory
from foundation.testing.rpc import TestRPC


@dataclasses.dataclass
class FoundationFixture:
    """Big object that contains all our optional testing fixtures and utilities."""

    factory: TestFactory
    errors: TestErrors
    rpc: TestRPC

    @classmethod
    def create(cls) -> FoundationFixture:
        factory = TestFactory()
        errors = TestErrors()
        rpc = TestRPC(factory, RPCRouter())
        return cls(factory=factory, errors=errors, rpc=rpc)


@pytest.fixture
def t() -> FoundationFixture:
    """Global test fixture with factory methods."""
    return FoundationFixture.create()
