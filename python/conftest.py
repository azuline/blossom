"""
This file contains our pytext fixtures. We have few exported fixtures, as most
"fixtures" are available as properties of the `t` fixture. See `backend/foundation/test`
for documentation on `t`.
"""

import asyncio
import logging
import random
from asyncio import AbstractEventLoop
from collections.abc import AsyncIterator, Iterator
from string import ascii_lowercase

# Configure logging for tests -- we will set up OpenTelemetry and fix this side effect
# nonsense later.
import foundation.log  # noqa
import psycopg
import pytest
import pytest_asyncio
from foundation.test.db import run_database_migrations
from foundation.test.fixture import TFix
from psycopg.sql import SQL, Identifier
from quart.typing import TestClientProtocol

from database.access import ConnPool, create_pg_pool
from foundation.env import ENV

# Tricks to avoid pytest's auto-test detection.
TestClientProtocol.__test__ = False  # type: ignore


logger = logging.getLogger(__name__)


# Create an instance of the default event loop for the session. This is an internal part
# of pytest-asyncio, but we redefine it in order to be able to create session-scoped
# async fixtures, as per:
# https://github.com/pytest-dev/pytest-asyncio/issues/75#issuecomment-570611843
@pytest.fixture(scope="session")
def event_loop(
    request: pytest.FixtureRequest,  # noqa: ARG001
) -> Iterator[AbstractEventLoop]:
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="session")
async def db() -> AsyncIterator[str]:
    db_name = "test_" + "".join(random.choice(ascii_lowercase) for _ in range(24))
    with psycopg.connect(ENV.database_url, autocommit=True) as conn:
        conn.execute(SQL("CREATE DATABASE {}").format(Identifier(db_name)))
    run_database_migrations(ENV.database_url + "/" + db_name)
    yield db_name


@pytest.fixture
def isolated_db() -> str:
    db_name = "test_iso_" + "".join(random.choice(ascii_lowercase) for _ in range(24))
    with psycopg.connect(ENV.database_url, autocommit=True) as conn:
        conn.execute(SQL("CREATE DATABASE {}").format(Identifier(db_name)))
    return db_name


@pytest_asyncio.fixture(scope="session")
async def pg_pool(db: str) -> AsyncIterator[ConnPool]:
    async with await create_pg_pool(ENV.database_url + "/" + db) as pg_pool:
        yield pg_pool


@pytest_asyncio.fixture
async def t(pg_pool: ConnPool) -> AsyncIterator[TFix]:
    async with await TFix.create(pg_pool=pg_pool) as t:
        yield t
