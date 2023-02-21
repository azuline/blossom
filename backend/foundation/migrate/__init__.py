
from yoyo import get_backend, read_migrations

from foundation.config import confvars
from foundation.root import BACKEND_ROOT

MIGRATIONS_PATH = str(BACKEND_ROOT / "migrations")


def run_database_migrations(url: str = confvars.yoyo_database_url) -> None:
    db_backend = get_backend(url)
    db_migrations = read_migrations(MIGRATIONS_PATH)
    with db_backend.lock():
        db_backend.apply_migrations(db_backend.to_apply(db_migrations))
