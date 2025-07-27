# Product (Backend)

The `product` package provides a backend for the product [frontend](../../typescript/product).

See [CLAUDE.md](./CLAUDE.md) for best practices, conventions, and patterns.

Run `just product devserver` to run the development server and `just product webserver` to run the production server.

# Framework

The [`framework/`] package extends [foundation](../foundation) with product-specific code.

## RPCs

[`framework/rpc.py`](./framework/rpc.py) wraps foundation's RPC system and provides `@rpc_product` and `ReqProduct`.

Each RPC must declare `authorization`. `@rpc_product` validates that the request meets the authorization requirements and sets `req.user` and `req.organization`. `@rpc_product` also begins a database transaction on `req.conn` for the request, scoped to the `authorization` through Row Level Security. The `authorization` levels are:

- `authorization="public"` allows anyone to call the RPC and begins an admin-scoped transaction that access all resources.a
- `authorization="user"` allows authenticated users to call the user and begins a user-scoped transaction that can access resources belonging to the user.
- `authorization="organization"` allows authenticated users with an activated organization to call the user and begins an organization-scoped transaction that can access resources belonging to the organization.

So by example:

```python
@dataclasses.dataclass(slots=True)
class ListBunniesIn:
    color: str


@dataclasses.dataclass(slots=True)
class ListBunniesOut:
    bunnies: ...


@dataclasses.dataclass(slots=True)
class BunniesAreAsleepError(RPCError):
    pass


@rpc_product("list_bunnies", authorization="organization", errors=[...])
async def list_bunnies(req: ReqProduct[ListBunniesIn]) -> ListBunniesOut:
    bunnies_m = await query_list_bunnies(req.conn, organization_id=req.organization.id, user_id=req.user.id, color=req.data.color)
    return ListBunniesOut(...)
```

# Features

TODO: some common feature builds

## Authentication

- log in
- log out
- clock in
- clock out

## Impersonation

TODO: build
