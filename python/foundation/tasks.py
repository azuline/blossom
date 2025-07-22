from __future__ import annotations

import asyncio
import time
from asyncio import Task
from collections.abc import Callable, Coroutine
from functools import partial
from typing import LiteralString, TypeVar

from foundation.errors import BaseError
from foundation.logs import get_logger

logger = get_logger()


T = TypeVar("T")


class UnsupervisedTasksTimeoutError(BaseError):
    pass


_unsupervised_tasks: set[Task] = set()


async def wait_for_unsupervised_tasks(*names: str, timeout: float = 10) -> None:
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
        raise UnsupervisedTasksTimeoutError(
            "timed out waiting for unsupervised tasks",
            tasks=[t.get_name() for t in _unsupervised_tasks],
        ) from e


def create_unsupervised_task[T, **P](
    name: LiteralString,
    fn: Callable[P, Coroutine[None, None, T]],
    *args: P.args,
    **kwargs: P.kwargs,
) -> Task[T]:
    async def wrapper() -> T:
        try:
            return await fn(*args, **kwargs)
        except Exception as e:
            logger.exception("async task failed", name=name)
            raise e

    t = asyncio.create_task(wrapper(), name=name)
    t.add_done_callback(partial(_handle_unsupervised_error_cb, name=name, started_at=time.time()))
    _unsupervised_tasks.add(t)
    t.add_done_callback(_unsupervised_tasks.discard)
    return t


def _handle_unsupervised_error_cb[T](future: asyncio.Future[T], name: str, started_at: float) -> None:
    e = future.exception()
    if e is not None:
        logger.exception("async task failed", name=name, started_at=started_at)
