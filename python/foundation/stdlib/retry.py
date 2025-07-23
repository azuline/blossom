import asyncio
import dataclasses
import random
from collections.abc import Awaitable, Callable
from typing import LiteralString, ParamSpec, TypeVar

from foundation.observability.errors import BaseError
from foundation.observability.logs import get_logger
from foundation.observability.metrics import MetricTagDict, metric_distribution

logger = get_logger()

T = TypeVar("T")
P = ParamSpec("P")


class MaxRetriesExceededError(BaseError):
    pass


@dataclasses.dataclass(slots=True)
class AsyncRetryer:
    """
    Allows retrying asynchronous coroutines with exponential backoff and jitter.

    Use like this:

        retryer = AsyncRetryer(name, **params)
        retryer.execute(fn, arg1, arg2, kwarg1=None)
    """

    # Keep cardinality of `name` low to avoid blasting metrics.
    name: LiteralString
    max_retries: int = 3
    backoff_unit_sec: float = 2
    metric_tags: MetricTagDict | None = None

    async def execute(self, fn: Callable[P, Awaitable[T]], *args: P.args, **kwargs: P.kwargs) -> T:
        num_try = 0
        try:
            while True:
                num_try += 1
                try:
                    return await fn(*args, **kwargs)
                except Exception as e:
                    if num_try >= self.max_retries:
                        raise e
                    log_fields: dict[str, str | int] = {
                        "name": self.name,
                        "num_try": num_try,
                        "max_retries": self.max_retries,
                        "error_type": e.__class__.__name__,
                        "error_repr": repr(e),
                        "error_str": str(e),
                    }
                    logger.warning("failed coroutine, backing off before retrying", **log_fields)
                    await asyncio.sleep(self.backoff_unit_sec * (2**num_try) + self.backoff_unit_sec * random.random())
                    logger.warning("retrying coroutine", **log_fields)
        finally:
            metric_distribution(f"{self.name}.retry", num_try, **(self.metric_tags or {}))
