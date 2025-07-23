import os
import subprocess

import click

from foundation.stdlib.paths import PYTHON_ROOT


@click.group()
def main() -> None:
    pass


@main.command()
def devserver():
    """Migrate the database."""
    cache_path = PYTHON_ROOT / ".dagster_cache"
    cache_path.mkdir(exist_ok=True)
    os.environ["DAGSTER_HOME"] = str(cache_path)
    subprocess.run(["dagster", "dev", "--dagit-port", "40813"], check=True)


if __name__ == "__main__":
    main()
