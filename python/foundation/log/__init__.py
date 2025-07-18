import functools
import logging
import sys
from collections.abc import Callable
from typing import ParamSpec, TypeVar

import click

P = ParamSpec("P")
T = TypeVar("T")


def option_log_level[**P, T](func: Callable[P, T]) -> Callable[P, T]:  # pragma: no cover
    """
    A decorator to add some shared click options to a Click command. Currently, the
    ``--log-level`` option is implemented by this decorator.

    This must be applied before the click ``command`` decorator.
    """

    @click.option(
        "--log-level",
        type=click.Choice(["DEBUG", "INFO", "WARNING"]),
        default="INFO",
        help="Logging level",
    )
    @functools.wraps(func)
    def wrapper(log_level: str, *args: P.args, **kwargs: P.kwargs) -> T:
        logger = logging.getLogger()
        logger.setLevel(log_level)
        return func(*args, **kwargs)

    return wrapper  # type: ignore


# Configure logging.
logger = logging.getLogger()
logger.setLevel(logging.INFO if "pytest" not in sys.modules else logging.DEBUG)

# Add a logging handler for stdout unless we are testing. Pytest
# captures logging output on its own.
if "pytest" not in sys.modules:  # pragma: no cover
    stream_formatter = logging.Formatter(
        "%(asctime)s.%(msecs)03d - %(name)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    stream_handler = logging.StreamHandler(sys.stdout)
    stream_handler.setFormatter(stream_formatter)
    logger.addHandler(stream_handler)
