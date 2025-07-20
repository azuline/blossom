from __future__ import annotations

import dataclasses

import pytest

from foundation.testing.errors import TestErrors
from foundation.testing.factory import TestFactory
from foundation.testing.rpc import TestRPC
from panopticon.app import create_router_panopticon


@dataclasses.dataclass
class ProductFixture:
    """Big object that contains all our optional testing fixtures and utilities."""

    factory: TestFactory
    errors: TestErrors
    rpc: TestRPC

    @classmethod
    def create(cls) -> ProductFixture:
        factory = TestFactory()
        errors = TestErrors()
        rpc = TestRPC(factory, create_router_panopticon())
        return cls(factory=factory, errors=errors, rpc=rpc)


@pytest.fixture
def t() -> ProductFixture:
    """Global test fixture with factory methods."""
    return ProductFixture.create()
