from foundation.webserver.rpc import RPCRouter
from foundation.webserver.webserver import create_webserver
from product.authn.routes import login, logout
from product.users.routes import init


def create_router_product() -> RPCRouter:
    router = RPCRouter()

    router.add_route(init)
    router.add_route(login)
    router.add_route(logout)

    return router


def create_app():
    return create_webserver(create_router_product())
