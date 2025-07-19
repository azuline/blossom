import inspect
import logging
from collections.abc import Generator
from contextlib import contextmanager
from dataclasses import asdict, is_dataclass
from datetime import datetime
from logging import StreamHandler
from typing import Any, cast

import sentry_sdk
import sentry_sdk.types
import structlog
from sentry_sdk.integrations.asyncio import AsyncioIntegration
from sentry_sdk.integrations.logging import LoggingIntegration
from structlog.stdlib import BoundLogger
from structlog.typing import EventDict
from structlog_sentry import SentryProcessor

from foundation.env import ENV

# Constants
DEFAULT_LOG_LEVEL = logging.DEBUG if ENV.log_level == "debug" else logging.INFO
SERVICE_NAME = ENV.service


def _value_formatter_processor(_: logging.Logger, _2: str, event_dict: EventDict) -> EventDict:
    for k, v in event_dict.items():
        if isinstance(v, datetime):
            event_dict[k] = v.isoformat()
    return event_dict


def _development_processor():
    def fn(_, __, event_dict: EventDict) -> EventDict:
        return {k: v for k, v in event_dict.items() if k not in ["env", "version", "service", "runtime-id", "timestamp"]}

    return fn


def _production_processor():
    extra = {"env": ENV.environment, "service": SERVICE_NAME, "version": ENV.commit}

    def fn(_: logging.Logger, _2: str, event_dict: EventDict) -> EventDict:
        event_dict.update(extra)
        # Move event to message for better log aggregation compatibility
        if "event" in event_dict:
            event_dict["message"] = event_dict.pop("event")
        return event_dict

    return fn


def _sentry_before_send(event: sentry_sdk.types.Event, hint: sentry_sdk.types.Hint) -> sentry_sdk.types.Event | None:
    from foundation.errors import BlossomError

    _exc_type, exc_value, _tb = hint.get("exc_info", [None])
    if isinstance(exc_value, BlossomError):
        # Do not report transient errors
        if exc_value.transient:
            return None
        # Add custom error data to Sentry
        event["extra"] = event.get("extra", {})
        if hasattr(exc_value, "data"):
            for k, v in exc_value.data.items():
                event["extra"][k] = v
        if is_dataclass(exc_value):
            event["extra"].update(asdict(exc_value))
    return event


def _initialize_logging() -> None:
    """Initialize structured logging with Sentry integration."""
    level = DEFAULT_LOG_LEVEL

    # Shared processors for all environments
    processors = [
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.stdlib.add_log_level,
        structlog.stdlib.add_logger_name,
        structlog.contextvars.merge_contextvars,
        _value_formatter_processor,
        structlog.stdlib.ExtraAdder(),
    ]

    # Initialize Sentry.
    if ENV.sentry_dsn:
        sentry_sdk.init(
            dsn=ENV.sentry_dsn,
            traces_sample_rate=1.0,
            profiles_sample_rate=1.0,
            environment=ENV.environment,
            release=ENV.commit,
            server_name=SERVICE_NAME,
            before_send=_sentry_before_send,
            integrations=[LoggingIntegration(event_level=None, level=None), AsyncioIntegration()],
        )
        processors.append(SentryProcessor(event_level=logging.ERROR, tag_keys=["env", "organization_id"]))

    if ENV.environment == "production":
        processors.extend([
            _production_processor(),
            structlog.processors.CallsiteParameterAdder({
                structlog.processors.CallsiteParameter.FUNC_NAME,
                structlog.processors.CallsiteParameter.PROCESS,
            }),
        ])
    else:
        processors.extend([_development_processor()])

    # Configure structlog
    structlog.configure_once(
        processors=[*processors, structlog.stdlib.ProcessorFormatter.wrap_for_formatter],
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )

    # Configure standard logger.
    root_logger = logging.getLogger()  # noqa: TID251
    root_logger.setLevel(level)
    formatter = structlog.stdlib.ProcessorFormatter(
        foreign_pre_chain=processors,
        processors=[
            structlog.stdlib.ProcessorFormatter.remove_processors_meta,
            structlog.dev.ConsoleRenderer(exception_formatter=structlog.dev.plain_traceback),
        ],
    )
    handler = StreamHandler()
    handler.setFormatter(formatter)
    root_logger.handlers = [handler]


# Initialize logging on module import
_initialize_logging()


def get_logger(debug: bool = False) -> BoundLogger:
    logger = structlog.stdlib.get_logger()

    if debug and DEFAULT_LOG_LEVEL == logging.INFO:
        # Get the module __name__ of the caller
        frm = inspect.stack()[1]
        mod = inspect.getmodule(frm[0])
        if mod is not None:
            logging.getLogger(mod.__name__).setLevel(logging.DEBUG)  # noqa: TID251

    return cast(BoundLogger, logger)


@contextmanager
def span(**kwargs: Any) -> Generator[None]:
    tokens = structlog.contextvars.bind_contextvars(**kwargs)
    try:
        yield
    finally:
        structlog.contextvars.reset_contextvars(**tokens)
