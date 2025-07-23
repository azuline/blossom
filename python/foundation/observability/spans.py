import atexit
import contextlib
import dataclasses
import os
from collections.abc import Generator
from typing import Any, LiteralString, cast

import ddtrace
import ddtrace.trace
import sentry_sdk
import structlog

from foundation.env import ENV
from foundation.observability.errors import ConfigurationError
from foundation.observability.logs import get_logger

logger = get_logger()


def initialize_tracing() -> None:
    if not ENV.datadog_enabled:
        ddtrace.tracer.enabled = False
        # The atexit handler slows down termination and is unnecessary if there is no agent.
        atexit.unregister(ddtrace.tracer._atexit)  # noqa: SLF001
        return
    ddtrace.patch(
        aiohttp=True,
        anthropic=True,
        asyncio=True,
        dramatiq=True,
        jinja2=True,
        openai=True,
        psycopg=True,
        structlog=True,
    )
    ddtrace.tracer.set_tags({"service": ENV.service, "env": ENV.environment, "version": ENV.version})
    if not ENV.datadog_agent_host or not ENV.datadog_api_key:
        raise ConfigurationError("DD_AGENT_HOST/DD_API_KEY not set: provision these keys or set DD_TRACE_ENABLED to false")


def set_tracing_envvars() -> None:
    # Set tracing envvars.
    os.environ["DD_SERVICE"] = ENV.service
    os.environ["DD_ENV"] = ENV.environment
    os.environ["DD_VERSION"] = ENV.version


@dataclasses.dataclass(slots=True)
class Span:
    name: str
    trace_id: int
    span_id: int
    tags: dict[str, Any]

    def trace_id_str(self) -> str:
        return str((1 << 64) - 1 & self.trace_id)

    def span_id_str(self) -> str:
        return str(self.span_id)


@contextlib.contextmanager
def span(name: LiteralString, resource: str | None = None, span_type: str | None = None, **kwargs: Any) -> Generator[Span]:
    parent_span = current_span()
    parent_tags = parent_span.tags if parent_span else {}
    with sentry_sdk.new_scope() as scope:
        scope.set_tags(parent_tags)
        scope.set_tags(kwargs)
        with ddtrace.tracer.trace(name, resource=resource, span_type=span_type) as span:
            if parent_tags:
                span.set_tags(parent_tags)  # type: ignore
            if kwargs:
                span.set_tags(kwargs)  # type: ignore
            tokens = structlog.contextvars.bind_contextvars(**kwargs)
            try:
                yield Span(name=span.name, trace_id=span.trace_id, span_id=span.span_id, tags=cast(dict[str, Any], dict(span.get_tags())))
            finally:
                structlog.contextvars.reset_contextvars(**tokens)


def current_span() -> Span | None:
    """Returns the current active span."""
    if span := ddtrace.tracer.current_span():
        return Span(name=span.name, trace_id=span.trace_id, span_id=span.span_id, tags=cast(dict[str, Any], dict(span.get_tags())))
    return None


def tag_current_span(**kwargs: Any) -> None:
    """Add tags to the current span."""
    scope = sentry_sdk.get_current_scope()
    scope.set_tags(kwargs)
    if span := ddtrace.tracer.current_span():
        span.set_tags(kwargs)  # type: ignore


@dataclasses.dataclass(slots=True)
class SpanDump:
    ctx: ddtrace.trace.Context | None
    spanz: Span | None


def span_dump() -> SpanDump:
    """Dump span context for transfer between runtime contexts (process, thread, async). Pass the output to `span_restore`."""
    return SpanDump(ctx=ddtrace.tracer.current_trace_context(), spanz=current_span())


@contextlib.contextmanager
def span_restore(name: LiteralString, dump: SpanDump) -> Generator[None]:
    """Restore the span context in a different runtime context (process, thread, async). Get the dump from `span_dump`."""
    if dump.ctx:
        ddtrace.tracer.context_provider.activate(dump.ctx)
    tags = dump.spanz.tags if dump.spanz else {}
    with span(name, **tags):
        yield
