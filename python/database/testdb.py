import hashlib
import secrets

import yoyo
from psycopg.sql import SQL, Identifier

from database.conn import connect_db_admin_nopool
from database.lock import lock
from foundation.env import ENV
from foundation.logs import get_logger
from foundation.paths import PYTHON_ROOT

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

        async with lock("testdb"), connect_db_admin_nopool() as conn:
            cursor = await conn.execute("SELECT 1 FROM pg_database WHERE datname = %s", (tmpl_name,))
            if await cursor.fetchone():
                logger.debug("template database already exists, reusing it", tmpl_name=tmpl_name)
                return tmpl_name

            logger.info("creating template database", tmpl_name=tmpl_name)
            await conn.execute(SQL("CREATE DATABASE {}").format(Identifier(tmpl_name)))
            migrations = yoyo.read_migrations(str(PYTHON_ROOT / "database/migrations"))
            db_uri_yoyo = self.database_uri(tmpl_name).replace("postgresql://", "postgresql+psycopg://")
            with yoyo.get_backend(db_uri_yoyo) as backend, backend.lock():
                backend.apply_migrations(backend.to_apply(migrations))
            await conn.execute("UPDATE pg_database SET datistemplate = true WHERE datname = %s", (tmpl_name,))

        logger.info("created template database", tmpl_name=tmpl_name)
        return tmpl_name

    async def create_db(self) -> str:
        tmpl_name = await self.create_template()
        db_name = f"test_{secrets.token_hex(8)}"
        async with connect_db_admin_nopool() as conn:
            await conn.execute(SQL("CREATE DATABASE {} WITH TEMPLATE {}").format(Identifier(db_name), Identifier(tmpl_name)))
        logger.debug("created test database from template", db_name=db_name, template=tmpl_name)
        return db_name

    async def drop_db(self, db_name: str):
        async with connect_db_admin_nopool() as conn:
            await conn.execute(
                """
                    SELECT pg_terminate_backend(pg_stat_activity.pid)
                    FROM pg_stat_activity
                    WHERE pg_stat_activity.datname = %s
                        AND pid <> pg_backend_pid()
                """,
                (db_name,),
            )
            await conn.execute(SQL("DROP DATABASE IF EXISTS {}").format(Identifier(db_name)))
        logger.debug("dropped test database", db_name=db_name)
