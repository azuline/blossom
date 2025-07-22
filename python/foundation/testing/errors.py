from foundation.errors import TESTING_CAPTURED_EXCEPTIONS


class TestErrors:
    __test__ = False

    def assert_reported(self, exc: type[BaseException]) -> None:
        """Check that an error was reported to Sentry."""
        assert exc in (type(e) for e in TESTING_CAPTURED_EXCEPTIONS)

    def assert_not_reported(self, exc: type[BaseException]) -> None:
        """Check that an error was reported to Sentry."""
        assert exc not in (type(e) for e in TESTING_CAPTURED_EXCEPTIONS)
