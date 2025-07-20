from foundation.errors import initialize_sentry
from foundation.logs import get_logger, initialize_logging

logger = get_logger()


def initialize_foundation() -> None:
    """Initialize the application foundation. Call this before running any commands."""
    initialize_logging()
    logger.debug("initialized foundation: logging")
    logger.debug("initializing foundation: sentry")
    initialize_sentry()
    logger.debug("initialized foundation: sentry")
