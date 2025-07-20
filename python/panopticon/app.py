from foundation.rpc import RPCRouter
from foundation.webserver import create_app_from_router


def create_router_panopticon() -> RPCRouter:
    router = RPCRouter()

    return router


def create_app():
    return create_app_from_router(create_router_panopticon())
