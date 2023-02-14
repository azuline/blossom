from typing import Any

import click
from pytest_asyncio.plugin import asyncio, functools

from foundation.log import option_log_level
from foundation.migrate import run_database_migrations
from foundation.rpc.codegen import codegen_typescript
from foundation.webserver import start_app
from product.users.create import create_user


def coro(f: Any) -> Any:
    """Use this decorator to create async click handlers."""

    @functools.wraps(f)
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        return asyncio.run(f(*args, **kwargs))

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
def user() -> None:
    """Operations on users."""


@user.command()
@click.option("--email", "-e", type=str, required=True, help="The new user's email.")
@click.option("--name", "-n", type=str, required=True, help="The new user's name.")
@click.option(
    "--password",
    "-p",
    type=str,
    help="The new user's password. Leave blank to create a signing up user.",
)
@coro
async def create(email: str, name: str, password: str | None) -> None:
    """Create a user."""
    await create_user(email=email, name=name, password=password)


if __name__ == "__main__":
    cli()
