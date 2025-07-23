from foundation.observability.errors import initialize_sentry
from foundation.observability.logs import get_logger, initialize_logging
from foundation.observability.spans import initialize_tracing, set_tracing_envvars
from foundation.stdlib.funcs import run_once

logger = get_logger()


@run_once
def initialize_instrumentation() -> None:
    """Initialize the application foundation. Call this before running any commands."""
    initialize_logging()
    logger.debug("initialized foundation: logging")
    logger.debug("initializing foundation: sentry")
    initialize_sentry()
    logger.debug("initialized foundation: sentry")
    logger.debug("initializing foundation: tracing")
    initialize_tracing()
    logger.debug("initialized foundation: tracing")


@run_once
def set_foundation_production_envvars() -> None:
    """Initialize the application foundation. Call this before running any commands."""
    set_tracing_envvars()
