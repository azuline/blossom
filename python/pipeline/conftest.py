from __future__ import annotations

import dataclasses

import pytest
from syrupy.assertion import SnapshotAssertion

from foundation.testing.errors import TestErrors
from foundation.testing.factory import TestFactory
from foundation.testing.rpc import TestRPC
from foundation.testing.snapshots import TestSnapshots
from foundation.webserver.rpc import RPCRouter


@dataclasses.dataclass
class PipelineFixture:
    """Big object that contains all our optional testing fixtures and utilities."""

    error: TestErrors
    factory: TestFactory
    rpc: TestRPC
    snapshot: TestSnapshots

    @classmethod
    def create(cls, snapshot_fixture: SnapshotAssertion) -> PipelineFixture:
        error = TestErrors()
        factory = TestFactory()
        rpc = TestRPC(factory, RPCRouter([]))
        snapshot = TestSnapshots(snapshot_fixture)
        return cls(error, factory, rpc, snapshot)


@pytest.fixture
def t(snapshot: SnapshotAssertion) -> PipelineFixture:
    """Global test fixture with factory methods."""
    return PipelineFixture.create(snapshot)
