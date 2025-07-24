import asyncio
from datetime import UTC, date, datetime

from foundation.stdlib.clock import CLOCK


async def test_clock():
    # Test now.
    assert CLOCK.now().date() == CLOCK.now().date()
    # Test set.
    with CLOCK.TESTING_set(datetime(2024, 2, 3, tzinfo=UTC)):
        assert CLOCK.now().date() == date(2024, 2, 3)
        t = CLOCK.now()
        await asyncio.sleep(0.01)
        assert t != CLOCK.now()
    # Test freeze.
    with CLOCK.TESTING_freeze(datetime(2024, 2, 3, tzinfo=UTC)):
        assert CLOCK.now().date() == date(2024, 2, 3)
        t = CLOCK.now()
        await asyncio.sleep(0.01)
        assert t == CLOCK.now()
