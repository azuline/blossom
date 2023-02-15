from dataclasses import dataclass
from typing import Any, Callable, Coroutine

from quart import Blueprint, ResponseReturnValue

from foundation.rpc.error import APIError


@dataclass
class Route:
    name: str
    in_: type[Any] | None
    out: type[Any] | None
    errors: list[type[APIError]]
    handler: Callable[[], Coroutine[Any, Any, ResponseReturnValue]]
    # Whether to codegen a client binding.
    codegen: bool


@dataclass
class Catalog:
    global_errors: list[type[APIError]]
    rpcs: list[Route]


# This is a global variable that stores the currently accumulated catalog of routes.
_catalog = Catalog(global_errors=[], rpcs=[])


def catalog_route(
    *,
    name: str,
    in_: type[Any] | None,
    out: type[Any] | None,
    errors: list[type[APIError]],
    handler: Callable[[], Coroutine[Any, Any, ResponseReturnValue]],
    codegen: bool,
) -> None:
    """
    catalog_route adds a route to the RPC catalog. The RPC catalog is read
    when applying the RPC routes to the webserver and codegen.
    """
    _catalog.rpcs.append(
        Route(
            name=name,
            in_=in_,
            out=out,
            errors=errors,
            handler=handler,
            codegen=codegen,
        )
    )


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
    import product.authn.routes  # noqa: F401
    import product.users.routes  # noqa: F401

    return _catalog


def create_blueprint() -> Blueprint:
    catalog = get_catalog()

    bp = Blueprint("api", __name__, url_prefix="/api")
    for route in catalog.rpcs:
        bp.route("/" + route.name, methods=["POST"])(route.handler)
    return bp
