import asyncio

import click

from database.schema.codegen import run_codegen
from database.schema.migrate import migrate_database
from foundation.env import ENV


@click.group()
def main() -> None:
    pass


@main.command()
def migrate():
    """Migrate the database."""
    migrate_database(ENV.database_uri)


@main.command()
def codegen():
    """Codegen models from the database."""
    asyncio.run(run_codegen())


if __name__ == "__main__":
    main()
