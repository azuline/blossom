import asyncio
import dataclasses
import hashlib
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from sqlalchemy import text

from database.conn import DBConnPool, connect_db_admin
from foundation.observability.errors import BaseError
from foundation.observability.logs import get_logger
from foundation.observability.metrics import metric_increment

logger = get_logger()


def _stable_hash(string: str) -> int:
    hash_digest = hashlib.md5(string.encode()).hexdigest()
    hash_int = int(hash_digest, 16) % (2**32)
    return abs(hash_int)


@dataclasses.dataclass(slots=True)
class LockAlreadyHeld(BaseError):
    name: str
    lock_id: int


class LockTimeoutError(BaseError, TimeoutError):
    pass


@asynccontextmanager
async def pg_advisory_lock(
    name: str,
    pool: DBConnPool | None = None,
    block: bool = True,
    *,
    block_timeout: float = 5,
) -> AsyncGenerator[None]:
    id_ = _stable_hash(name)

    async with connect_db_admin(pg_pool=pool) as c:
        if not block:
            logger.info("trying to acquire advisory lock (nonblocking)", id=id_, name=name)
            result = await c.execute(text("SELECT pg_try_advisory_xact_lock(:id)"), {"id": id_})
            row = result.first()
            locked = row[0] if row else False
            if not locked:
                logger.info("failed to acquire advisory lock (nonblocking)", id=id_, name=name)
                metric_increment("database.lock", success=False)
                raise LockAlreadyHeld(name=name, lock_id=id_)
            logger.info("acquired advisory lock (nonblocking)", id=id_, name=name)
            metric_increment("database.lock", success=True)
        try:
            if block:
                logger.info("trying to acquire advisory lock (blocking)", id=id_, name=name)
                try:
                    # We must always call the pg_advisory_unlock no matter what in case we secured
                    # the lock in the DB and timed out in the response I/O.
                    await asyncio.wait_for(c.execute(text("SELECT pg_advisory_xact_lock(:id)"), {"id": id_}), timeout=block_timeout)
                except TimeoutError as e:
                    logger.info("failed to acquire advisory lock (blocking)", id=id_, name=name)
                    metric_increment("database.lock", success=False)
                    await c.rollback()
                    raise LockTimeoutError from e
                logger.info("acquired advisory lock (blocking)", id=id_, name=name)
                metric_increment("database.lock", success=True)
            yield
        finally:
            logger.info("releasing advisory lock", id=id_, name=name)
            await c.execute(text("SELECT pg_advisory_unlock(:id)"), {"id": id_})
            await c.commit()
