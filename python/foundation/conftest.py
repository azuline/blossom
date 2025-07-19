from __future__ import annotations

import dataclasses

import pytest
import quart

from foundation.rpc.catalog import RPCCatalog
from foundation.testing.errors import TestErrors
from foundation.testing.factory import TestFactory
from foundation.testing.rpc import TestRPC
from foundation.webserver import create_app_from_catalog


async def _create_empty_app() -> quart.Quart:
    return await create_app_from_catalog(RPCCatalog(global_errors=[], rpcs=[], raw_routes=[]))


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
        rpc = TestRPC(factory, _create_empty_app)
        return cls(factory=factory, errors=errors, rpc=rpc)


@pytest.fixture
def t() -> FoundationFixture:
    """Global test fixture with factory methods."""
    return FoundationFixture.create()
