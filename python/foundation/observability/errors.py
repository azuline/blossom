import contextlib
import dataclasses
import inspect
from types import TracebackType
from typing import Any, ClassVar, Literal, get_args

import ddtrace
import sentry_sdk
import sentry_sdk.integrations.asyncio
import sentry_sdk.integrations.quart
import sentry_sdk.types

from foundation.env import ENV, EnvironmentEnum
from foundation.observability.logs import get_logger

logger = get_logger()


class BaseError(Exception):
    """
    A base first-party error class. All of our internal errors should subclass from this error in
    order to distinguish first-party and third-party errors.
    """

    transient: ClassVar[bool] = False

    def __init__(self, message: str | None = None, **kwargs) -> None:
        super().__init__(message)
        self.message = message
        self.data = kwargs

    def __str__(self):
        # Subclass may not initialize data.
        data: dict[str, Any] = {}

        if dataclasses.is_dataclass(self):
            data.update(dataclasses.asdict(self))
        elif x := getattr(self, "data", None):
            data.update(x)

        if data:
            additional_info = "\n".join([f"- {key}: {value}" for key, value in data.items()])
            return f"{super().__str__()}\n\nData:\n{additional_info}"

        return super().__str__()


class ImpossibleError(BaseError):
    """
    Errors that are used to indicate an impossible code path. Always indicates a mistaken assumption
    and subsequent bug.
    """


class ConfigurationError(BaseError):
    """
    This error is raised when something is wrong with the configuration.
    """


class suppress_error(contextlib.AbstractContextManager):
    # This is implemented as a class instead of via contextlib.contextmanager so that we can set the
    # `__exit__` return type to True, which indicates that the error was suppressed. This prevents
    # typecheckers from treating code written after a suppress_error block as impossible to reach.

    def __init__(self, *errors: type[BaseException], environments: tuple[EnvironmentEnum, ...] | None = None, print_traceback: bool = True):
        self.errors = errors
        self.environments = environments or get_args(EnvironmentEnum)
        self.print_traceback = print_traceback
        assert self.errors, "cannot pass no errors into suppress_error, must pass at least 1 (e.g. Exception)"

    def __enter__(self) -> None:
        pass

    def __exit__(
        self,
        _exc_type: type[BaseException] | None,
        exc_value: BaseException | None,
        _traceback: TracebackType | None,
    ) -> Literal[True]:
        if not exc_value:
            return True
        if isinstance(exc_value, self.errors) and ENV.environment in self.environments:
            frm = inspect.stack()[1]
            mod = inspect.getmodule(frm[0])
            tb = inspect.getframeinfo(frm[0])

            modname = mod.__name__ if mod else None
            funcname = tb.function
            if self.print_traceback:
                logger.exception("suppressing error", error=exc_value.__class__.__name__, module=modname, function=funcname, exc_info=True)
            else:
                logger.debug("suppressing error", error=exc_value.__class__.__name__, module=modname, function=funcname)
            return True
        raise


TESTING_CAPTURED_EXCEPTIONS: list[BaseException] = []


def report_error(exc: BaseException) -> None:
    """Reports an error to Sentry."""
    if ENV.testing:
        TESTING_CAPTURED_EXCEPTIONS.append(exc)
    sentry_sdk.capture_exception(exc)  # noqa: TID251
    if span := ddtrace.tracer.current_span():
        span.record_exception(exc)


def initialize_sentry():
    if not ENV.sentry_dsn:
        return
    sentry_sdk.init(
        dsn=ENV.sentry_dsn,
        traces_sample_rate=1.0,
        profiles_sample_rate=1.0,
        environment=ENV.environment,
        release=ENV.version,
        server_name=ENV.service,
        before_send=_sentry_before_send,
        # Enables Quart, Aiohttp, etc..
        default_integrations=True,
        integrations=[
            sentry_sdk.integrations.quart.QuartIntegration(),
            sentry_sdk.integrations.asyncio.AsyncioIntegration(),
        ],
    )


def _sentry_before_send(event: sentry_sdk.types.Event, hint: sentry_sdk.types.Hint) -> sentry_sdk.types.Event | None:
    _exc_type, exc_value, _tb = hint.get("exc_info", [None])
    if isinstance(exc_value, BaseError):
        # Do not report transient errors
        if exc_value.transient:
            return None
        # Add custom error data to Sentry
        event["extra"] = event.get("extra", {})
        if hasattr(exc_value, "data"):
            for k, v in exc_value.data.items():
                event["extra"][k] = v
        if dataclasses.is_dataclass(exc_value):
            event["extra"].update(dataclasses.asdict(exc_value))
    return event
