import time

from foundation.observability.errors import initialize_sentry
from foundation.observability.logs import get_logger, initialize_logging
from foundation.observability.metrics import initialize_metrics, metric_timing
from foundation.observability.spans import initialize_tracing, set_tracing_envvars
from foundation.stdlib.funcs import run_once

logger = get_logger()


@run_once
def initialize_instrumentation() -> None:
    """Initialize the application foundation. Call this before running any commands."""
    start = time.time()
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
    metric_timing("instrumentation.initialize.duration", time.time() - start, sample_rate=1)


@run_once
def set_foundation_production_envvars() -> None:
    set_tracing_envvars()
