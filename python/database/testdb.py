import hashlib
import secrets

import yoyo
from sqlalchemy import text

from database.conn import connect_db_admin
from database.lock import pg_advisory_lock
from foundation.env import ENV
from foundation.observability.logs import get_logger
from foundation.stdlib.paths import PYTHON_ROOT

logger = get_logger()


class TestDB:
    __test__ = False

    def database_uri(self, db_name: str) -> str:
        base_uri, _ = ENV.database_uri.rsplit("/", 1)
        return f"{base_uri}/{db_name}"

    def _compute_template_name(self) -> str:
        """Compute the template database name for the current schema version."""
        migrations_dir = PYTHON_ROOT / "database" / "migrations"
        hasher = hashlib.sha256()
        if migrations_dir.exists():
            for migration_file in sorted(migrations_dir.glob("*.sql")):
                hasher.update(migration_file.name.encode())
                hasher.update(migration_file.read_bytes())
        version = hasher.hexdigest()[:8]
        return f"test_template_{version}"

    async def create_template(self) -> str:
        """Create a template database for the current schema version."""
        tmpl_name = self._compute_template_name()

        async with pg_advisory_lock("testdb"), connect_db_admin() as conn:
            cursor = await conn.execute(text("SELECT 1 FROM pg_database WHERE datname = :name"), {"name": tmpl_name})
            if cursor.first():
                logger.debug("template database already exists, reusing it", tmpl_name=tmpl_name)
                return tmpl_name

            logger.info("creating template database", tmpl_name=tmpl_name)
            # Use raw SQL for CREATE DATABASE as it cannot be parameterized
            await conn.execute(text(f'CREATE DATABASE "{tmpl_name}"'))
            migrations = yoyo.read_migrations(str(PYTHON_ROOT / "database/migrations"))
            db_uri_yoyo = self.database_uri(tmpl_name).replace("postgresql://", "postgresql+psycopg://")
            with yoyo.get_backend(db_uri_yoyo) as backend, backend.lock():
                backend.apply_migrations(backend.to_apply(migrations))
            await conn.execute(text("UPDATE pg_database SET datistemplate = true WHERE datname = :name"), {"name": tmpl_name})

        logger.info("created template database", tmpl_name=tmpl_name)
        return tmpl_name

    async def create_db(self) -> str:
        tmpl_name = await self.create_template()
        db_name = f"test_{secrets.token_hex(8)}"
        async with connect_db_admin() as conn:
            # Use raw SQL for CREATE DATABASE as it cannot be parameterized
            await conn.execute(text(f'CREATE DATABASE "{db_name}" WITH TEMPLATE "{tmpl_name}"'))
        logger.debug("created test database from template", db_name=db_name, template=tmpl_name)
        return db_name

    async def drop_db(self, db_name: str):
        async with connect_db_admin() as conn:
            logger.debug("dropping testdb", db_name=db_name)
            # Use raw SQL for DROP DATABASE as it cannot be parameterized
            await conn.execute(text(f'DROP DATABASE IF EXISTS "{db_name}" WITH (FORCE)'))
            logger.debug("dropped testdb", db_name=db_name)
