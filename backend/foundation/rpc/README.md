# rpc

The `rpc` package provides abstractions for defining and implementing RPC
routes. This package also generates TypeScript bindings from the RPC
definitions.

The `webserver` package mounts all declared routes when starting up.

## Defining Routes

The `rpc` package exposes the decorator `route` for defining RPC routes. This
decorator:

1. Registers the RPC route into the _RPC catalog_. The RPC catalog is used
   downstream by the [webserver](../webserver) and RPC codegen script.
2. Wraps the RPC route in the shared middlewares, which handle traces,
   authentication, authorization, data parsing, database connections, and
   exception handling.

Visit the RPC declaration for additional documentation.

To ensure that the catalog is fully seeded at runtime, all files that define
routes should be imported in `catalog.py`'s `get_catalog` function.

The `route` decorator's usage is as follows:

```python
# Handlers define dataclasses for input and output data. The `route` decorator
# handles parsing to and from these dataclasses.
@dataclass
class ReqIn:
    num_bunnies: int
    acceptable_colors: list[str] | None


@dataclass
class Bunny:
    external_id: str
    color: Color
    name: str
    cuteness_level: int


@dataclass
class ReqOut:
    bunnies: list[Bunny]


# Errors should subclass from APIError. Errors should also be dataclasses.
@dataclass
class CannotMakeBunniesError(APIError):
    pass


# The route decorator has two parameters that must be specified:
#
# - Authorization determines whether the route is public or restricted to a
#   subset of requesters.
# - Errors declares the set of errors that this handler raises. This is used to
#   generate the set of possible errors on the frontend. It must be maintained by
#   hand.
#
# The input and output types are inferred from the function type signature. The
# RPC name is inferred from the function name.
@route(authorization="tenant", errors=[CannotMakeBunniesError])
async def generate_bunnies(req: Req[ReqIn]) -> ReqOut:
    # The `req` parameter contains many useful attributes for writing handlers.
    # Visit it in the code for additional documentation.
    if req.user is None:
        raise CannotMakeBunniesError

    return ReqOut(bunnies=await req.cq.q.fetch_bunnies(tenant_id=req.tenant.id))
```

## Codegen

The codegen script is available inside the `make codegen` command in the
backend Makefile. It is also available as a command in the backend CLI.

The codegen script reads in all defined routes, generates TypeScript types from
them, and emits them to `frontend/codegen/rpc`. These types are used by the
frontend to create a type-safe RPC interface.
