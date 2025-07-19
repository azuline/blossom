from typing import cast

import click
import yoyo
from foundation.logs import get_logger
from foundation.paths import PYTHON_ROOT
from yoyo.backends import DatabaseBackend

from database.access.access import set_driver_tag

logger = get_logger()


def migrate_database(db_uri: str) -> None:
    logger.info("migrating database")
    migrations_path = PYTHON_ROOT / "database" / "migrations"
    migrations = yoyo.read_migrations(str(migrations_path.absolute()))
    with cast(DatabaseBackend, yoyo.get_backend(set_driver_tag(db_uri))) as backend, backend.lock():
        unapplied_migrations = backend.to_apply(migrations)
        logger.info("applying migrations", total_migrations=len(migrations), unapplied_migrations=len(unapplied_migrations))
        try:
            backend.apply_migrations(unapplied_migrations)
        except Exception as e:
            # Get the failing migration information
            current_migration = next(iter(unapplied_migrations))
            logger.error("migration failed", migration_id=current_migration.id, error=f"\n\n{e!s}\n")
            raise click.ClickException("please check the migration and database state before retrying") from e
