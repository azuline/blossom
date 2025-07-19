import asyncio
import functools
import inspect


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
            loop = asyncio.get_running_loop()
            if loop not in cache_by_loop:
                cache_by_loop[loop] = {}
            cache = cache_by_loop[loop]
            if args not in cache:
                cache[args] = func(*args)
            return cache[args]

        return sync_wrapper
