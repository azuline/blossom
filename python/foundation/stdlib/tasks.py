from __future__ import annotations

import asyncio
import time
from asyncio import Task
from collections.abc import Callable, Coroutine
from functools import partial
from typing import LiteralString

from foundation.observability.errors import BaseError
from foundation.observability.logs import get_logger
from foundation.observability.metrics import metric_increment, metric_timing
from foundation.observability.spans import span_dump, span_restore

logger = get_logger()


class UnsupervisedTasksTimeoutError(BaseError):
    pass


_unsupervised_tasks: set[Task] = set()


async def wait_for_unsupervised_tasks(*names: str, timeout: float = 5) -> None:
    # Since these are being tracked in a global set, we need to filter out tasks that are not
    # running in the current loop. Otherwise, we'll see the following error on CI:
    # > ValueError: The future belongs to a different loop than the one specified as the loop argument
    tasks = [t for t in _unsupervised_tasks if t._loop == asyncio.get_running_loop()]  # noqa: SLF001
    if names:
        tasks = [t for t in tasks if t.get_name() in names]
    if not tasks:
        return
    try:
        await asyncio.wait_for(asyncio.wait(tasks), timeout=timeout)
    except TimeoutError as e:
        raise UnsupervisedTasksTimeoutError("timed out waiting for unsupervised tasks", tasks=[t.get_name() for t in _unsupervised_tasks]) from e


def create_unsupervised_task[T, **P](
    name: LiteralString,
    fn: Callable[P, Coroutine[None, None, T]],
    *args: P.args,
    **kwargs: P.kwargs,
) -> Task[T]:
    sdump = span_dump()

    async def wrapper() -> T:
        with span_restore(name, sdump):
            try:
                return await fn(*args, **kwargs)
            except Exception:
                logger.exception("async task failed", name=name)
                raise

    t = asyncio.create_task(wrapper(), name=name)
    _unsupervised_tasks.add(t)
    t.add_done_callback(partial(_unsupervised_task_done_callback, name=name, started_at=time.time()))
    t.add_done_callback(_unsupervised_tasks.discard)
    return t


def _unsupervised_task_done_callback[T](future: asyncio.Future[T], name: str, started_at: float) -> None:
    exc = future.exception()
    success = exc is None
    if not success:
        logger.exception("async task failed", name=name, started_at=started_at, exc_info=exc)
    metric_increment("tasks.unsupervised_task", task=name, success=success)
    metric_timing("tasks.unsupervised_task.duration", time.time() - started_at, task=name, success=success)
