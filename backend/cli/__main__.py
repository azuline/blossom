# Allow multiple functions to be defined with the same name.
# mypy: disable-error-code=no-redef
# ruff: noqa: F811
from typing import Any

import click
from pytest_asyncio.plugin import asyncio, functools

from codegen.sqlc.models import TenantsInboundSource
from foundation.database import ConnQuerier, conn_admin, create_pg_pool
from foundation.config import confvars
from foundation.log import option_log_level
from foundation.migrate import run_database_migrations
from foundation.rpc.codegen import codegen_typescript
from foundation.test.rand import TestRandGen
from foundation.webserver import start_app
from product.tenants.lib import tenant_add_user, tenant_create
from product.users.create import user_create


def coro(f: Any) -> Any:
    """Use this decorator to create async click handlers."""

    @functools.wraps(f)
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        return asyncio.run(f(*args, **kwargs))

    return wrapper


def with_cq(f: Any) -> Any:
    """Use this decorator to create a ConnQuerier instance for a command's executor."""

    @functools.wraps(f)
    async def wrapper(*args: Any, **kwargs: Any) -> Any:
        async with await create_pg_pool(confvars.psycopg_database_url) as pg_pool:
            async with conn_admin(pg_pool) as cq:
                return await f(*args, **kwargs, cq=cq)

    return wrapper


@click.group()
@option_log_level
def cli() -> None:
    """Blossom CLI"""


@cli.command()
@click.option("--host", "-h", default="127.0.0.1", help="Address to listen on.")
@click.option("--port", "-p", default=40851, help="Port to listen on.")
def start(host: str, port: int) -> None:
    """Start the backend services."""
    start_app(host, port)


@cli.command()
def migrate() -> None:
    """Migrate the Postgres database."""
    run_database_migrations()


@cli.command()
def codegen() -> None:
    """Codegen the frontend RPC bindings."""
    codegen_typescript()


@cli.group()
def ops() -> None:
    """Manual operations executed via CLI."""


@ops.group()
def tenant() -> None:
    """Operations on tenants."""


@tenant.command()
@click.option("--name", type=str, required=True, help="The new tenant's name.")
@click.option(
    "--inbound-source",
    type=TenantsInboundSource,
    required=True,
    default=TenantsInboundSource.UNKNOWN,
    help="The tenant's inbound source.",
)
@coro
@with_cq
async def create(cq: ConnQuerier, name: str, inbound_source: TenantsInboundSource) -> None:
    """Create a tenant."""
    await tenant_create(cq=cq, name=name, inbound_source=inbound_source)


@tenant.command()
@click.option("--tenant-id", type=str, required=True, help="The tenant's external ID.")
@click.option("--user-id", type=str, required=True, help="The user's external ID.")
@coro
@with_cq
async def add_user(cq: ConnQuerier, tenant_id: str, user_id: TenantsInboundSource) -> None:
    """Add a user to a tenant."""
    await tenant_add_user(cq=cq, tenant_id=tenant_id, user_id=user_id)


@ops.group()
def user() -> None:
    """Operations on users."""


@user.command()
@click.option("--email", type=str, required=True, help="The new user's email.")
@click.option("--name", type=str, required=True, help="The new user's name.")
@click.option(
    "--password",
    type=str,
    help="The new user's password. Leave blank to create a signing up user.",
)
@coro
@with_cq
async def create(cq: ConnQuerier, email: str, name: str, password: str | None) -> None:
    """Create a user."""
    await user_create(cq=cq, email=email, name=name, password=password)


@cli.group()
def dev() -> None:
    """Operations meant for local development."""


@dev.command()
@coro
@with_cq
async def create_test_account(cq: ConnQuerier) -> None:
    """Create a test account with associated tenant."""
    rand = TestRandGen()
    user = await user_create(
        cq=cq,
        email=rand.email(),
        name="Demo User",
        password="password",
    )
    tenant = await tenant_create(
        cq=cq,
        name=rand.string(),
        inbound_source=TenantsInboundSource.UNKNOWN,
    )
    await tenant_add_user(cq=cq, tenant_id=tenant.external_id, user_id=user.external_id)
    print(
        f"""\
Created test account. Credentials:

{user.email}
password
"""
    )


if __name__ == "__main__":
    cli()
