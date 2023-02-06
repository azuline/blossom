from pathlib import Path

from yoyo import get_backend, read_migrations
from yoyo.migrations import os

from foundation.conf import confvars

MIGRATIONS_PATH = Path(os.environ["BLOSSOM_ROOT"]) / "backend" / "product" / "migrations"


def run_database_migrations(url: str = confvars.yoyo_database_url) -> None:
    db_backend = get_backend(url)
    db_migrations = read_migrations(str(MIGRATIONS_PATH))

    with db_backend.lock():
        db_backend.apply_migrations(db_backend.to_apply(db_migrations))
