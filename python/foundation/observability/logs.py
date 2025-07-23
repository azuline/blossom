import datetime
import inspect
import logging
import sys
from logging import StreamHandler
from typing import Any, cast

import structlog
from colorama import Fore, Style
from structlog.dev import Column, ConsoleRenderer, KeyValueColumnFormatter, LogLevelColumnFormatter, plain_traceback
from structlog.stdlib import BoundLogger
from structlog.typing import EventDict

from foundation.env import ENV


def get_logger(force_debug: bool = False) -> BoundLogger:
    if force_debug:
        # Get the module __name__ of the caller
        frm = inspect.stack()[1]
        mod = inspect.getmodule(frm[0])
        if mod is not None:
            logging.getLogger(mod.__name__).setLevel(logging.DEBUG)  # noqa: TID251

    return structlog.stdlib.get_logger()


def initialize_logging() -> None:
    """Initialize structured logging configuration."""
    level = logging.DEBUG if ENV.log_level == "debug" or ENV.testing else logging.INFO

    # Processors, assemble!
    common_processors = [
        _processor,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.add_log_level,
        structlog.processors.format_exc_info,
        structlog.contextvars.merge_contextvars,
        structlog.stdlib.ExtraAdder(),
        structlog.processors.EventRenamer("message"),
        structlog.processors.CallsiteParameterAdder({structlog.processors.CallsiteParameter.MODULE, structlog.processors.CallsiteParameter.FUNC_NAME}),
    ]
    if ENV.environment == "production":
        common_processors.extend([structlog.processors.CallsiteParameterAdder({structlog.processors.CallsiteParameter.PROCESS, structlog.processors.CallsiteParameter.THREAD})])

    # Configure structlog.
    structlog.configure_once(
        processors=[*common_processors, structlog.stdlib.ProcessorFormatter.wrap_for_formatter],
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=not ENV.testing,
    )

    # Define renderer.
    renderer = structlog.processors.JSONRenderer()
    if ENV.environment == "development":
        renderer = ConsoleRenderer(
            columns=[
                Column("timestamp", KeyValueColumnFormatter(key_style=None, value_style=Fore.LIGHTBLACK_EX, reset_style="", value_repr=_format_timestamp)),
                Column("service", KeyValueColumnFormatter(key_style=None, value_style=Fore.YELLOW, reset_style=Style.RESET_ALL, value_repr=str)),
                Column("level", LogLevelColumnFormatter(ConsoleRenderer.get_default_level_styles(), reset_style=Style.RESET_ALL, width=0)),
                Column("module", KeyValueColumnFormatter(key_style=None, value_style=Style.BRIGHT, reset_style=Style.RESET_ALL, value_repr=str, prefix="[", postfix="]")),
                Column("message", KeyValueColumnFormatter(key_style=None, value_style="", reset_style=Style.RESET_ALL, value_repr=str)),
                Column("", KeyValueColumnFormatter(key_style=Fore.BLUE, value_style=Fore.CYAN, reset_style=Style.RESET_ALL, value_repr=str)),
            ],
            exception_formatter=plain_traceback,
            pad_level=False,
        )

    # Configure formatter.
    root_logger = logging.getLogger()  # noqa: TID251
    root_logger.setLevel(level)
    formatter = structlog.stdlib.ProcessorFormatter(
        foreign_pre_chain=common_processors,
        processors=[structlog.stdlib.ProcessorFormatter.remove_processors_meta, renderer],
    )
    handler = StreamHandler(sys.stderr)
    handler.setFormatter(formatter)
    root_logger.handlers = [handler]


def _processor(_: logging.Logger, _2: str, event_dict: EventDict) -> EventDict:
    from foundation.observability.errors import report_error
    from foundation.observability.spans import current_span

    # Add custom keys.
    event_dict["service"] = ENV.service
    if ENV.environment != "development":
        event_dict["env"] = ENV.environment
        event_dict["version"] = ENV.version
    # Add span tags.
    if span := current_span():
        event_dict.update(span.tags)
    # Serialize special types to str.
    for k, v in event_dict.items():
        if isinstance(v, datetime.datetime):
            event_dict[k] = v.isoformat()
    # Report errors to sentry.
    if exc_info := event_dict.get("exc_info"):
        if exc_info is True:
            _3, exc_info, _4 = sys.exc_info()
        report_error(cast(BaseException, exc_info))
    return event_dict


def _format_timestamp(x: Any) -> str:
    return datetime.datetime.fromisoformat(x).strftime("%H:%M:%S.%f")[:-3]
