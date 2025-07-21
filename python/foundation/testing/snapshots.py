from typing import Any

from syrupy import SnapshotAssertion
from syrupy.types import PropertyFilter, PropertyMatcher


class TestSnapshots:
    __test__ = False

    def __init__(self, snapshot_fixture: SnapshotAssertion):
        self._fixture = snapshot_fixture

    def assert_snapshot(
        self,
        value: Any,
        *,
        include: PropertyFilter | None = None,
        exclude: PropertyFilter | None = None,
        matcher: PropertyMatcher | None = None,
    ) -> None:
        """Check that a value is consistent across tests."""
        assert self._fixture(include=include, exclude=exclude, matcher=matcher) == value
