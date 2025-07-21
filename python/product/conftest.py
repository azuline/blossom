from __future__ import annotations

import dataclasses

import pytest
from syrupy.assertion import SnapshotAssertion

from database.__codegen__ import models
from foundation.logs import get_logger
from foundation.testing.errors import TestErrors
from foundation.testing.factory import TestFactory
from foundation.testing.rpc import TestRPC
from foundation.testing.snapshots import TestSnapshots
from product.app import create_router_product
from product.framework.rpc import SESSION_ID_KEY

logger = get_logger()


class TestRPCProduct(TestRPC):
    __test__ = False

    async def login_as(self, user: models.User, organization: models.Organization | None = None) -> None:
        logger.debug("setting session to user", user_id=user.id, user_email=user.email)
        async with (await self.underlying_client()).session_transaction() as quart_sess:
            session = await self._factory.session(user=user, organization=organization)
            quart_sess[SESSION_ID_KEY] = session.id


@dataclasses.dataclass
class ProductFixture:
    """Big object that contains all our optional testing fixtures and utilities."""

    error: TestErrors
    factory: TestFactory
    rpc: TestRPCProduct
    snapshot: TestSnapshots

    @classmethod
    def create(cls, snapshot_fixture: SnapshotAssertion) -> ProductFixture:
        error = TestErrors()
        factory = TestFactory()
        rpc = TestRPCProduct(factory, create_router_product())
        snapshot = TestSnapshots(snapshot_fixture)
        return cls(error, factory, rpc, snapshot)


@pytest.fixture
def t(snapshot: SnapshotAssertion) -> ProductFixture:
    """Global test fixture with factory methods."""
    return ProductFixture.create(snapshot)
