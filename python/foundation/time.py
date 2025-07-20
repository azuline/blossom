import contextlib
import datetime
from collections.abc import Generator

from foundation.env import ENV


class Clock:
    def __init__(self) -> None:
        self._TESTING_frozen_time: datetime.datetime | None = None
        self._TESTING_base_time: datetime.datetime | None = None
        self._TESTING_base_time_set_at: datetime.datetime | None = None

    def now(self) -> datetime.datetime:
        """Get the current time in UTC."""
        if self._TESTING_frozen_time:
            return self._TESTING_frozen_time
        if self._TESTING_base_time:
            assert self._TESTING_base_time_set_at is not None
            return self._TESTING_base_time + (datetime.datetime.now(datetime.UTC) - self._TESTING_base_time_set_at)  # noqa: TID251
        return datetime.datetime.now(datetime.UTC)  # noqa: TID251

    def time(self) -> float:
        """Get the current time as a Unix timestamp."""
        return self.now().timestamp()

    def TESTING_set(self, time: datetime.datetime) -> None:
        """Adjust the "current time" of the clock. The clock will continue ticking."""
        assert ENV.testing
        self._TESTING_base_time = time
        self._TESTING_base_time_set_at = CLOCK.now()

    @contextlib.contextmanager
    def TESTING_freeze(self, time: datetime.datetime) -> Generator[None]:
        """Freeze the clock so it always returns the value of the `time` parameter from `now()`."""
        assert ENV.testing
        self._TESTING_frozen_time = time
        yield
        self._TESTING_frozen_time = None


CLOCK = Clock()
