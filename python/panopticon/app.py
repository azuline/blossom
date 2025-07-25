from foundation.webserver.rpc import RPCRouter
from foundation.webserver.webserver import create_webserver


def create_router_panopticon() -> RPCRouter:
    router = RPCRouter(product_specific_standard_errors=[])

    return router


def create_app():
    return create_webserver(create_router_panopticon())
