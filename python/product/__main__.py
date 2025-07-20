import os
import subprocess

import click

from foundation.env import ENV
from foundation.errors import ConfigurationError
from foundation.webserver import start_webserver


@click.group()
def main() -> None:
    pass


@main.command()
def devserver():
    """Run the product web application backend devserver."""
    os.environ["QUART_DEBUG"] = "1"
    os.environ["QUART_APP"] = "product.app:create_app()"
    os.environ["QUART_SKIP_DOTENV"] = "1"  # We handle it ourselves.
    os.environ["SERVICE"] = "product"
    subprocess.run(["quart", "run", "--port", str(ENV.product_port)], check=True)


@main.command()
def webserver():
    """Run the product web application backend production webserver."""
    if not ENV.product_host:
        raise ConfigurationError("PRODUCT_HOST environment variable not set")
    if not ENV.product_port:
        raise ConfigurationError("PRODUCT_PORT environment variable not set")
    start_webserver("product.app:create_app()", ENV.product_host, ENV.product_port)


if __name__ == "__main__":
    main()
