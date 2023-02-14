"""
This file contains our pytext fixtures. We have few exported fixtures, as most
"fixtures" are available as properties of the `t` fixture. See `backend/foundation/test`
for documentation on `t`.
"""

import asyncio
import logging
import pathlib
import random
from asyncio import AbstractEventLoop
from string import ascii_lowercase
from typing import AsyncIterator, Iterator

import _pytest.pathlib
import psycopg
import pytest
import pytest_asyncio
from quart.typing import TestClientProtocol

# Configure logging for tests -- we will set up OpenTelemetry and fix this side effect
# nonsense later.
import foundation.log  # noqa
from foundation.config import confvars
from foundation.database import ConnPool, create_pg_pool
from foundation.migrate import run_database_migrations
from foundation.test.factory import TestFactory
from foundation.test.fixture import TFix

# Tricks to avoid pytest's auto-test detection.
TestClientProtocol.__test__ = False  # type: ignore
TestFactory.__test__ = False  # type: ignore


logger = logging.getLogger(__name__)


# Create an instance of the default event loop for the session. This is an internal part
# of pytest-asyncio, but we redefine it in order to be able to create session-scoped
# async fixtures, as per:
# https://github.com/pytest-dev/pytest-asyncio/issues/75#issuecomment-570611843
@pytest.fixture(scope="session")
def event_loop(request: pytest.FixtureRequest) -> Iterator[AbstractEventLoop]:  # noqa: ARG001
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="session")
async def db() -> AsyncIterator[str]:
    db_name = "test_" + "".join(random.choice(ascii_lowercase) for _ in range(24))
    with psycopg.connect(confvars.psycopg_database_url, autocommit=True) as conn:
        conn.execute(f"CREATE DATABASE {db_name}")
    run_database_migrations(confvars.yoyo_database_url + "/" + db_name)
    yield db_name


@pytest.fixture()
def isolated_db() -> str:
    db_name = "test_iso_" + "".join(random.choice(ascii_lowercase) for _ in range(24))
    with psycopg.connect(confvars.psycopg_database_url, autocommit=True) as conn:
        conn.execute(f"CREATE DATABASE {db_name}")
    return db_name


@pytest_asyncio.fixture(scope="session")
async def pg_pool(db: str) -> AsyncIterator[ConnPool]:
    async with await create_pg_pool(confvars.psycopg_database_url + "/" + db) as pg_pool:
        yield pg_pool


@pytest_asyncio.fixture
async def t(pg_pool: ConnPool) -> AsyncIterator[TFix]:
    async with await TFix.create(pg_pool=pg_pool) as t:
        yield t


# Pytest has a bug where it doesn't handle namespace packages and treats same-name files
# in different packages as a naming collision.
#
# https://stackoverflow.com/a/72366347
# Tweaked from ^ to handle our foundation/product split.

resolve_pkg_path_orig = _pytest.pathlib.resolve_package_path
namespace_pkg_dirs = [str(d) for d in pathlib.Path(__file__).parent.iterdir() if d.is_dir()]

# patched method
def resolve_package_path(path: pathlib.Path) -> pathlib.Path | None:
    # call original lookup
    result = resolve_pkg_path_orig(path)
    if result is None:
        result = path  # let's search from the current directory upwards
    for parent in result.parents:
        if str(parent) in namespace_pkg_dirs:
            return parent
    return None


# apply patch
_pytest.pathlib.resolve_package_path = resolve_package_path
