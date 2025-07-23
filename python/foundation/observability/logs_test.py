"""Tests for the logging module to ensure logger.exception reports to Sentry."""

from foundation.conftest import FoundationFixture
from foundation.logs import get_logger

logger = get_logger()


def test_logger_exception_reports_to_sentry(t: FoundationFixture) -> None:
    """Verify that logger.exception reports exceptions to Sentry."""

    try:
        raise ValueError("test error for sentry reporting")
    except ValueError:
        logger.exception("caught an error")

    t.error.assert_reported(ValueError)


def test_logger_error_doesnt_report_to_sentry(t: FoundationFixture) -> None:
    """Verify that logger.exception reports exceptions to Sentry."""

    try:
        raise ValueError("test error for sentry reporting")
    except ValueError:
        logger.error("caught an error")

    t.error.assert_not_reported(ValueError)
