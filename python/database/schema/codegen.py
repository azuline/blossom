"""Run SQLc codegen using a test database."""

import subprocess
import tempfile
from pathlib import Path

import yaml
from foundation.testing.testdb import TestDB

logger = get_logger()


async def run_codegen():
    """Run SQLc codegen using a clean test database."""
    testdb = TestDB()
    db_name = None

    try:
        with tempfile.NamedTemporaryFile(prefix=".sqlc.config", suffix=".yaml", dir=".") as tmp_config:
            # Create a testdb.
            db_name = await testdb.create_db()
            test_db_uri = testdb.db_uri(db_name)
            logger.info("Using test database for codegen", db_name=db_name)

            # Create a new temporary config pointing to the testdb.
            with Path("sqlc.yaml").open("r") as f:
                config = yaml.safe_load(f)
            config["sql"][0]["database"]["uri"] = test_db_uri
            with Path(tmp_config.name).open("w") as tmp:
                yaml.dump(config, tmp, default_flow_style=False)

            # Run sqlc codegen with passthrough output
            logger.info("Running sqlc vet")
            subprocess.run(["sqlc", "vet", "-f", tmp_config.name], check=True)

            logger.info("Running sqlc generate")
            subprocess.run(["sqlc", "generate", "-f", tmp_config.name], check=True)

            logger.info("Codegen completed successfully")

            # Generate schema.sql if pgmigrate is available
            logger.info("Generating schema.sql")
            result = subprocess.run(["pgmigrate", "dump", "-d", test_db_uri, "--out", "schema.sql"], capture_output=True, text=True)
            if result.returncode == 0:
                logger.info("Generated schema.sql successfully")
            else:
                logger.warning("pgmigrate not available or failed", stderr=result.stderr)
    finally:
        if db_name:
            await testdb.drop_db(db_name)
