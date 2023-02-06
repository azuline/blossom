import logging

import pytest
from yoyo import get_backend, read_migrations

from foundation.conf import confvars
from foundation.mig.migrate import MIGRATIONS_PATH

logger = logging.getLogger(__name__)


@pytest.mark.asyncio
async def test_migration_steps(isolated_db: str) -> None:
    """
    Test that, for each migration, the up -> down -> up path doesn't
    cause an error. Ladder our way up through the migration chain.
    """
    backend = get_backend(confvars.yoyo_database_url + "/" + isolated_db)
    migrations = read_migrations(str(MIGRATIONS_PATH))

    for mig in migrations:
        backend.apply_one(mig)
        backend.rollback_one(mig)
        backend.apply_one(mig)
