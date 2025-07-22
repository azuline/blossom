from typing import Any, cast

import pytest
import structlog.testing

from foundation.env import ENV
from foundation.errors import BlossomError, _sentry_before_send, suppress_error


class Test1Error(BlossomError):
    __test__ = False


class Test1ChildError(Test1Error):
    __test__ = False


class Test2Error(BlossomError):
    __test__ = False


def test_suppress_error():
    assert ENV.environment == "development", "this test only works in development"

    with suppress_error(BlossomError):
        raise BlossomError
    with suppress_error(BlossomError):
        raise Test1Error

    # Test nothing happens when no error.
    with suppress_error(BlossomError):
        pass

    # Test error subclass filtering.
    with suppress_error(Test1Error):
        raise Test1Error
    with suppress_error(Test1Error):
        raise Test1ChildError

    # Test sibling error non-filtering.
    with pytest.raises(Test1Error), suppress_error(Test2Error):
        raise Test1Error

    # Test environment filtering.
    with suppress_error(BlossomError, environments=("development",)):
        raise BlossomError
    with suppress_error(BlossomError, environments=("production", "development")):
        raise BlossomError

    # Test environment non-filtering.
    with pytest.raises(BlossomError), suppress_error(BlossomError, environments=("production",)):
        raise BlossomError


def test_sentry_before_send_filters_transient_errors():
    """Test that transient errors are not sent to Sentry."""

    class TransientError(BlossomError):
        transient = True

    # Create a mock event and hint
    event = cast(Any, {"extra": {}})
    hint = {"exc_info": (TransientError, TransientError("test"), None)}

    # Should return None for transient errors
    result = _sentry_before_send(event, hint)
    assert result is None


def test_sentry_before_send_adds_custom_error_data():
    """Test that custom error data is added to Sentry events."""

    class CustomError(BlossomError):
        pass

    error = CustomError("test error", user_id="123", org_id="456")
    event = cast(Any, {"extra": {}})
    hint = {"exc_info": (CustomError, error, None)}

    result = _sentry_before_send(event, hint)
    assert result is not None
    assert "extra" in result
    assert result["extra"]["user_id"] == "123"
    assert result["extra"]["org_id"] == "456"


def test_suppress_error_logs_correct_kwargs():
    with structlog.testing.capture_logs() as captured:

        def example_function():
            with suppress_error(ValueError):
                raise ValueError("test error")

        example_function()

    assert len(captured) == 1
    log = captured[0]
    assert log["event"] == "suppressing error"
    assert log["error"] == "ValueError"
    assert log["module"] == "foundation.errors_test"
    assert log["function"] == "example_function"
    assert log["log_level"] == "error"  # exception logs at error level
    assert "exc_info" in log
