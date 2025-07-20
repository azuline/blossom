import asyncio
import functools
import inspect
from collections.abc import Callable

from foundation.errors import suppress_error


def memoize(func):
    cache_by_loop = {}

    if inspect.iscoroutinefunction(func):

        @functools.wraps(func)
        async def async_wrapper(*args):
            loop = asyncio.get_running_loop()
            if loop not in cache_by_loop:
                cache_by_loop[loop] = {}
            cache = cache_by_loop[loop]
            if args not in cache:
                cache[args] = await func(*args)
            return cache[args]

        return async_wrapper

    else:

        @functools.wraps(func)
        def sync_wrapper(*args):
            loop = "no-loop"
            with suppress_error(RuntimeError):
                loop = asyncio.get_running_loop()
            if loop not in cache_by_loop:
                cache_by_loop[loop] = {}
            cache = cache_by_loop[loop]
            if args not in cache:
                cache[args] = func(*args)
            return cache[args]

        return sync_wrapper


def run_once(func: Callable[..., None]):
    has_run = False

    if asyncio.iscoroutinefunction(func):

        @functools.wraps(func)
        async def async_wrapper(*args, **kwargs):
            nonlocal has_run
            if not has_run:
                has_run = True
                await func(*args, **kwargs)

        return async_wrapper

    else:

        @functools.wraps(func)
        def sync_wrapper(*args, **kwargs):
            nonlocal has_run
            if not has_run:
                has_run = True
                func(*args, **kwargs)

        return sync_wrapper
