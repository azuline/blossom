import pytest

from foundation.retry import AsyncRetryer


async def test_async_retryer():
    retryer = AsyncRetryer(name="test", max_retries=3, backoff_unit_sec=0.001)

    # Test 1: Passing function returns immediately and is only called once
    call_count = 0

    async def passing_function() -> bool:
        nonlocal call_count
        call_count += 1
        return True

    assert await retryer.execute(passing_function)
    assert call_count == 1

    # Test 2: Function that fails until third call is called thrice
    call_count = 0

    async def fails_twice_function() -> bool:
        nonlocal call_count
        call_count += 1
        if call_count < 3:
            raise ValueError("not ready yet")
        return True

    retryer = AsyncRetryer(name="test", max_retries=3, backoff_unit_sec=0.001)
    assert await retryer.execute(fails_twice_function)
    assert call_count == 3

    # Test 3: Function called five times produces an error (max_retries=3)
    call_count = 0

    async def always_fails_function() -> bool:
        nonlocal call_count
        call_count += 1
        raise RuntimeError("always fails")

    retryer = AsyncRetryer(name="test", max_retries=3, backoff_unit_sec=0.001)
    with pytest.raises(RuntimeError, match="always fails"):
        await retryer.execute(always_fails_function)
    assert call_count == 3
