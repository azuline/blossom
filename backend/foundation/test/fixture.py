from __future__ import annotations

from typing import Any

from foundation.database import ConnPool
from foundation.test.db import TestDB
from foundation.test.factory import TestFactory
from foundation.test.rand import TestRandGen
from foundation.test.rpc import TestRPC


class TFix:
    """
    Named TFix for ease of auto-importing and typing.

    This is the aggregate `t` fixture that we expose in pytest. The goal of this fixture
    is to make writing tests easy by providing a single accessible place to write shared
    text functions and fixtures.
    """

    f: TestFactory
    db: TestDB
    rpc: TestRPC
    rand: TestRandGen

    @classmethod
    async def create(cls, *, pg_pool: ConnPool) -> TFix:
        """Async alternative to __init__"""
        t = cls()
        t.db = TestDB(t, pg_pool=pg_pool)
        t.f = TestFactory(t, conn=await t.db.conn_admin())
        t.rpc = TestRPC(t)
        t.rand = TestRandGen()
        return t

    async def __aenter__(self) -> TFix:
        return self

    async def __aexit__(self, *_: Any) -> None:
        await self.db.cleanup()
