# Panopticon (Backend)

The `panopticon` package provides a backend for the panopticon [frontend](../../typescript/panopticon).

See [CLAUDE.md](./CLAUDE.md) for best practices, conventions, and patterns.

Run `just panopticon devserver` to run the development server and `just panopticon webserver` to run the production server.

# Framework

The [`framework/`] package extends [foundation](../foundation) with panopticon-specific code.

## RPCs

[`framework/rpc.py`](./framework/rpc.py) wraps foundation's RPC system and provides `@rpc_panopticon` and `Reqpanopticon`.

TODO: panopticon rpc description

# Features

TODO: panopticon feature builds

## Authentication

## Database Management

## User Management

## Operations Catalog
