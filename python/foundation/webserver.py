import os
import subprocess

import quart
from ddtrace.contrib.asgi import TraceMiddleware

from foundation.env import ENV, ServiceEnum
from foundation.logs import get_logger
from foundation.rpc import RPCRouter

logger = get_logger()


def create_webserver(router: RPCRouter) -> quart.Quart:
    """
    Create, set up, and return a new Quart application object. If a ``config``
    is passed in, it will be modified and used; however, if one is not passed
    in, then the default configuration will be used.

    :param object config: A config object to configure Quart with.

    :return: The created Quart application.
    """
    logger.debug("creating quart app", num_routes=len(router.routes))
    app = quart.Quart(__name__)
    app.secret_key = ENV.quart_session_key
    app.config.update(
        SESSION_COOKIE_SECURE=not app.debug,
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE="Lax",
    )
    app.asgi_app = TraceMiddleware(app.asgi_app)

    app.route("/ping")(_ping_handler)
    for r in router.routes:
        r.mount(app)
    for bp in router.raw_blueprints:
        app.register_blueprint(bp)
    return app


def start_webserver(app: str, host: str, port: int) -> None:  # pragma: no cover
    subprocess.run(["hypercorn", app, "--bind", f"{host}:{port}", "--graceful-timeout", "30", "--worker-class", "uvloop", "--workers", str(ENV.webserver_num_workers)], check=True)


def _ping_handler() -> quart.Response:
    logger.info("received ping request")
    return quart.jsonify({"ok": True, "version": ENV.version})


def set_webserver_devserver_envvars(*, service: ServiceEnum, app: str) -> None:
    os.environ["QUART_DEBUG"] = "1"
    os.environ["QUART_SKIP_DOTENV"] = "1"  # We handle it ourselves.
    os.environ["SERVICE"] = service
    os.environ["QUART_APP"] = app
