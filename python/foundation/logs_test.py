from typing import Any, cast

from foundation.errors import BlossomError


def test_sentry_before_send_filters_transient_errors():
    """Test that transient errors are not sent to Sentry."""
    from foundation.logs import _sentry_before_send

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
    from foundation.logs import _sentry_before_send

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
