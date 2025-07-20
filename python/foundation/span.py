from collections.abc import Generator
from contextlib import contextmanager
from typing import Any

import ddtrace
import sentry_sdk
import structlog


@contextmanager
def span(**kwargs: Any) -> Generator[None]:
    tokens = structlog.contextvars.bind_contextvars(**kwargs)
    try:
        yield
    finally:
        structlog.contextvars.reset_contextvars(**tokens)


def tag_current_span(**kwargs: Any) -> None:
    """Add tags to the current span."""
    scope = sentry_sdk.get_current_scope()
    scope.set_tags(kwargs)
    if span := ddtrace.tracer.current_span():
        span.set_tags(kwargs)  # type: ignore
