import contextlib
import datetime
from collections.abc import Iterator

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

    @contextlib.contextmanager
    def TESTING_set(self, time: datetime.datetime) -> Iterator[None]:
        """A context manager that sets the "current time" of the clock. The clock will continue ticking."""
        assert ENV.testing
        self._TESTING_base_time = time
        self._TESTING_base_time_set_at = datetime.datetime.now(datetime.UTC)  # noqa: TID251
        yield
        self._TESTING_base_time = None
        self._TESTING_base_time_set_at = None

    @contextlib.contextmanager
    def TESTING_freeze(self, time: datetime.datetime) -> Iterator[None]:
        """A contextmanager that freezes the clock so it always returns the value of the `time` parameter from `now()`."""
        assert ENV.testing
        self._TESTING_frozen_time = time
        yield
        self._TESTING_frozen_time = None


CLOCK = Clock()
