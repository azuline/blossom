import asyncio
import signal
from typing import Any

import quart
from hypercorn.asyncio import serve
from hypercorn.config import Config
from quart import Quart

from foundation.env import ENV
from foundation.logs import get_logger
from foundation.rpc import RPCRouter

logger = get_logger()


def create_app_from_router(router: RPCRouter) -> quart.Quart:
    """
    Create, set up, and return a new Quart application object. If a ``config``
    is passed in, it will be modified and used; however, if one is not passed
    in, then the default configuration will be used.

    :param object config: A config object to configure Quart with.

    :return: The created Quart application.
    """
    logger.debug("Creating Quart app.")
    app = Quart(__name__)
    app.config.update(
        SESSION_COOKIE_SECURE=not app.debug,
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE="Lax",
    )
    app.secret_key = ENV.quart_session_key
    for r in router.routes:
        r.mount(app)
    for bp in router.raw_blueprints:
        app.register_blueprint(bp)
    return app


def start_app_prod(app: quart.Quart, host: str, port: int) -> None:  # pragma: no cover
    config = Config()
    config.bind = [f"{host}:{port}"]
    # Run two workers per container.
    config.workers = 2

    # https://hypercorn.readthedocs.io/en/latest/how_to_guides/api_usage.html#graceful-shutdown
    shutdown_event = asyncio.Event()

    def _signal_handler(*_: Any) -> None:
        shutdown_event.set()

    loop = asyncio.get_event_loop()
    loop.add_signal_handler(signal.SIGTERM, _signal_handler)

    async def run() -> None:
        await serve(app, config, shutdown_trigger=shutdown_event.wait)  # type: ignore

    loop.run_until_complete(run())
