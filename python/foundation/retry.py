import asyncio
import dataclasses
from collections.abc import Awaitable, Callable
from typing import Any, LiteralString, ParamSpec, TypeVar

from foundation.errors import BlossomError
from foundation.logs import get_logger
from foundation.metrics import metric_distribution

logger = get_logger()

T = TypeVar("T")
P = ParamSpec("P")


class MaxRetriesExceededError(BlossomError):
    pass


@dataclasses.dataclass
class AsyncRetryer:
    """
    Supports retrying asynchronous coroutines with exponential backoff and jitter.

    Use like this:

        retryer = AsyncRetryer(name, **params)
        retryer.execute(fn, arg1, arg2, kwarg1=None)
    """

    # Keep cardinality of `name` low to avoid blasting metrics.
    name: LiteralString
    max_retries: int = 3
    backoff_unit_sec: float = 0.1
    metric_tags: dict[str, Any] | None = None

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
                    # Backoff.
                    await asyncio.sleep(self.backoff_unit_sec * num_try)
                    logger.warning(
                        "retrying coroutine",
                        name=self.name,
                        num_try=num_try,
                        max_retries=self.max_retries,
                        error_type=e.__class__.__name__,
                        error_repr=repr(e),
                        error_str=str(e),
                    )
        finally:
            metric_distribution(f"{self.name}.retry", num_try, **(self.metric_tags or {}))
