from foundation.rpc import RPCRouter
from foundation.webserver import create_webserver


def create_router_panopticon() -> RPCRouter:
    router = RPCRouter()

    return router


def create_app():
    return create_webserver(create_router_panopticon())
