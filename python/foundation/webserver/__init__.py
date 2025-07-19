"""
This module implements the Quart application function pattern. To create a new
Quart app instance, call ``create_app()``.
"""

import asyncio
import logging
import signal
from typing import Any

from hypercorn.asyncio import serve
from hypercorn.config import Config
from quart import Quart

from foundation.config import ENV
from foundation.database import ConnPool, create_pg_pool
from foundation.rpc.catalog import create_blueprint

SECRET_LENGTH = 32

logger = logging.getLogger(__name__)


async def create_app(
    *,
    # For test injection.
    pg_pool: ConnPool | None = None,
) -> Quart:
    """
    Create, set up, and return a new Quart application object. If a ``config``
    is passed in, it will be modified and used; however, if one is not passed
    in, then the default configuration will be used.

    :param object config: A config object to configure Quart with.

    :return: The created Quart application.
    """
    pg_pool = pg_pool or await create_pg_pool(ENV.database_url)

    logger.debug("Creating Quart app.")
    app = Quart(__name__)
    app.config.update(
        SESSION_COOKIE_SECURE=not app.debug,
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE="Lax",
        PG_POOL=pg_pool,
    )
    app.secret_key = ENV.session_secret
    app.register_blueprint(create_blueprint())
    return app


def debug_app() -> Quart:  # pragma no cover
    return asyncio.run(create_app())


def start_app(host: str, port: int) -> None:  # pragma no cover
    config = Config()
    config.bind = [f"{host}:{port}"]
    # Run one worker per container.
    config.workers = 1

    # https://hypercorn.readthedocs.io/en/latest/how_to_guides/api_usage.html#graceful-shutdown
    shutdown_event = asyncio.Event()

    def _signal_handler(*_: Any) -> None:
        shutdown_event.set()

    loop = asyncio.get_event_loop()
    loop.add_signal_handler(signal.SIGTERM, _signal_handler)

    async def run() -> None:
        app = await create_app()
        await serve(app, config, shutdown_trigger=shutdown_event.wait)

    loop.run_until_complete(run())
