import random

from foundation.funcs import memoize


async def test_memoize():
    @memoize
    def sync() -> float:
        return random.random()

    @memoize
    async def notsync() -> float:
        return random.random()

    assert sync() == sync()
    assert await notsync() == await notsync()


async def test_run_once():
    sync_ctr = 0
    async_ctr = 0

    @memoize
    def sync() -> int:
        nonlocal sync_ctr
        assert sync_ctr <= 1
        sync_ctr += 1
        return sync_ctr

    @memoize
    async def notsync() -> int:
        nonlocal async_ctr
        assert async_ctr <= 1
        async_ctr += 1
        return async_ctr

    assert sync() == sync()
    await notsync()
    await notsync()
