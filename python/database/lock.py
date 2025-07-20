import asyncio
import hashlib
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from dataclasses import dataclass

from database.conn import DBConnPool, connect_db_admin
from foundation.errors import BlossomError
from foundation.logs import get_logger

logger = get_logger()


def _stable_hash(string: str) -> int:
    hash_digest = hashlib.md5(string.encode()).hexdigest()
    hash_int = int(hash_digest, 16) % (2**32)
    return abs(hash_int)


@dataclass
class LockAlreadyHeld(BlossomError):
    name: str
    lock_id: int


class LockTimeoutError(BlossomError, TimeoutError):
    pass


@asynccontextmanager
async def lock(
    name: str,
    pool: DBConnPool | None = None,
    block: bool = True,
    *,
    block_timeout: float = 5,
) -> AsyncGenerator[None]:
    id_ = _stable_hash(name)

    async with connect_db_admin(pool) as c:
        if not block:
            logger.info("trying to acquire advisory lock (nonblocking)", id=id_, name=name)
            result = await c.execute("SELECT pg_try_advisory_xact_lock(%s)", (id_,))
            locked = await result.fetchone()
            if not locked:
                logger.info("failed to acquire advisory lock (nonblocking)", id=id_, name=name)
                raise LockAlreadyHeld(name=name, lock_id=id_)
            logger.info("acquired advisory lock (nonblocking)", id=id_, name=name)
        try:
            if block:
                logger.info("trying to acquire advisory lock (blocking)", id=id_, name=name)
                try:
                    # We must always call the pg_advisory_unlock no matter what in case we secured
                    # the lock in the DB and timed out in the response I/O.
                    await asyncio.wait_for(c.execute("SELECT pg_advisory_xact_lock(%s)", (id_,)), timeout=block_timeout)
                except TimeoutError as e:
                    logger.info("failed to acquire advisory lock (blocking)", id=id_, name=name)
                    await c.rollback()
                    raise LockTimeoutError from e
                logger.info("acquired advisory lock (blocking)", id=id_, name=name)
            yield
        finally:
            logger.info("releasing advisory lock", id=id_, name=name)
            await c.execute("SELECT pg_advisory_unlock(%s)", (id_,))
            await c.commit()
