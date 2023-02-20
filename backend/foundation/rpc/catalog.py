from dataclasses import dataclass
from typing import Any, Callable, Coroutine, Literal

from quart import Blueprint, ResponseReturnValue

from foundation.rpc.error import APIError

Method = Literal["GET", "POST"]


@dataclass
class RPCRoute:
    name: str
    in_: type[Any] | None
    out: type[Any] | None
    errors: list[type[APIError]]
    method: Method
    handler: Callable[[], Coroutine[Any, Any, ResponseReturnValue]]


@dataclass
class RawRoute:
    name: str
    method: Method
    handler: Callable[[], Coroutine[Any, Any, ResponseReturnValue]]


@dataclass
class Catalog:
    global_errors: list[type[APIError]]
    rpcs: list[RPCRoute]
    # Routes to mount that aren't RPCs.
    raw_routes: list[RawRoute]


# This is a global variable that stores the currently accumulated catalog of routes.
_catalog = Catalog(global_errors=[], rpcs=[], raw_routes=[])


def catalog_rpc(
    *,
    name: str,
    in_: type[Any] | None,
    out: type[Any] | None,
    errors: list[type[APIError]],
    method: Method,
    handler: Callable[[], Coroutine[Any, Any, ResponseReturnValue]],
) -> None:
    """
    catalog_rpc adds a route to the RPC catalog. The RPC catalog is read
    when applying the RPC routes to the webserver and codegen.
    """
    _catalog.rpcs.append(
        RPCRoute(name=name, in_=in_, out=out, errors=errors, method=method, handler=handler)
    )


def catalog_raw_route(
    *,
    name: str,
    method: Method,
    handler: Callable[[], Coroutine[Any, Any, ResponseReturnValue]],
) -> None:
    """
    catalog_raw_route adds a raw handler to the catalog. The raw handler is mounted on the Quart
    webserver, but is not a part of the RPC codegen system.
    """
    _catalog.raw_routes.append(RawRoute(name=name, method=method, handler=handler))


def catalog_global_error(error: type[APIError]) -> None:
    """
    catalog_error adds an error to the RPC catalog. The errors are read when running frontend
    codegen.
    """
    _catalog.global_errors.append(error)


def get_catalog() -> Catalog:
    # Because routes register themselves into the catalog upon import,
    # we need a central place to define the import paths for all routes.
    # This function is that central place.
    # ruff: noqa: F401
    import product.authn.routes
    import product.users.routes

    return _catalog


def create_blueprint() -> Blueprint:
    catalog = get_catalog()

    bp = Blueprint("api", __name__, url_prefix="/api")
    for route in catalog.rpcs:
        bp.route("/" + route.name, methods=[route.method])(route.handler)
    for rawr in catalog.raw_routes:
        bp.route("/" + rawr.name, methods=[rawr.method])(rawr.handler)
    return bp
