import subprocess

import quart

from foundation.env import ENV
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

    @app.route("/ping")
    def _ping() -> quart.Response:
        logger.info("received ping request")
        return quart.jsonify({"ok": True, "version": ENV.commit})

    for r in router.routes:
        r.mount(app)
    for bp in router.raw_blueprints:
        app.register_blueprint(bp)
    return app


def start_webserver(app: str, host: str, port: int) -> None:  # pragma: no cover
    subprocess.run(["hypercorn", app, "--bind", f"{host}:{port}", "--graceful-timeout", "30", "--worker-class", "uvloop", "--workers", str(ENV.webserver_num_workers)], check=True)
