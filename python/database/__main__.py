import click

from database.migrate import migrate_database
from foundation.env import ENV


@click.group()
def main() -> None:
    pass


@main.command()
def migrate():
    """Migrate the database."""
    migrate_database(ENV.database_uri)


if __name__ == "__main__":
    main()
