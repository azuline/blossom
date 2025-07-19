import asyncio
from datetime import UTC, date, datetime

from foundation.time import CLOCK


async def test_clock():
    # Test now.
    assert CLOCK.now().date() == datetime.now(UTC).date()
    # Test set.
    assert CLOCK.TESTING_set(datetime(2024, 2, 3, tzinfo=UTC))
    assert CLOCK.now().date() == date(2024, 2, 3)
    t = CLOCK.now()
    await asyncio.sleep(0.01)
    assert t != CLOCK.now()
    # Test freeze.
    assert CLOCK.TESTING_freeze(datetime(2024, 2, 3, tzinfo=UTC))
    assert CLOCK.now().date() == date(2024, 2, 3)
    t = CLOCK.now()
    await asyncio.sleep(0.01)
    assert t == CLOCK.now()
