"""Run SQLc codegen using a test database."""

import asyncio
import subprocess
import tempfile
from pathlib import Path

import yaml

from database.testdb import TestDB
from foundation.logs import get_logger
from foundation.paths import PYTHON_ROOT

logger = get_logger()


async def main():
    """Run SQLc codegen."""
    testdb = TestDB()

    db_name = await testdb.create_db()
    try:
        test_db_uri = testdb.database_uri(db_name)
        logger.info("using test database for codegen", db_name=db_name)

        with tempfile.NamedTemporaryFile(prefix=".sqlc.config", suffix=".yaml", dir=".") as tmp_config:
            with Path("sqlc.yaml").open("r") as f:
                config = yaml.safe_load(f)
            config["sql"][0]["database"]["uri"] = test_db_uri
            with Path(tmp_config.name).open("w") as tmp:
                yaml.dump(config, tmp, default_flow_style=False)

            logger.info("validating database queries")
            subprocess.run(["sqlc", "vet", "-f", tmp_config.name], check=True)
            logger.info("generating python bindings")
            subprocess.run(["sqlc", "generate", "-f", tmp_config.name], check=True)
            logger.info("codegen completed successfully")

            logger.info("generating schema.sql")
            subprocess.run(["pgmigrate", "dump", "-d", test_db_uri, "--out", str(PYTHON_ROOT / "database/schema.sql")], check=True)
            logger.info("schema.sql generated successfully")
    finally:
        await testdb.drop_db(db_name)


if __name__ == "__main__":
    asyncio.run(main())
