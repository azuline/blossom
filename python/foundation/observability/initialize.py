from foundation.observability.errors import initialize_sentry
from foundation.observability.logs import get_logger, initialize_logging
from foundation.observability.metrics import initialize_metrics
from foundation.observability.spans import initialize_tracing, set_tracing_envvars
from foundation.stdlib.funcs import run_once

logger = get_logger()


@run_once
def initialize_instrumentation() -> None:
    """Initialize the application foundation. Call this before running any commands."""
    initialize_logging()
    logger.debug("initialized logging")
    logger.debug("initializing sentry")
    initialize_sentry()
    logger.debug("initialized sentry")
    logger.debug("initializing tracing")
    initialize_tracing()
    logger.debug("initialized tracing")
    logger.debug("initializing metrics")
    initialize_metrics()
    logger.debug("initialized metrics")


@run_once
def set_foundation_production_envvars() -> None:
    set_tracing_envvars()
