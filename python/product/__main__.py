import subprocess

import click

from foundation.env import ENV
from foundation.observability.errors import ConfigurationError
from foundation.observability.initialize import set_foundation_production_envvars
from foundation.webserver.webserver import set_webserver_devserver_envvars, start_webserver


@click.group()
def main() -> None:
    pass


@main.command()
def devserver():
    """Run the product web application backend devserver."""
    set_webserver_devserver_envvars(service="product", app="product.app:create_app()")
    subprocess.run(["quart", "run", "--port", str(ENV.product_port)], check=True)


@main.command()
def webserver():
    """Run the product web application backend production webserver."""
    if not ENV.product_host:
        raise ConfigurationError("PRODUCT_HOST environment variable not set")
    if not ENV.product_port:
        raise ConfigurationError("PRODUCT_PORT environment variable not set")
    set_foundation_production_envvars()
    start_webserver("product.app:create_app()", ENV.product_host, ENV.product_port)


if __name__ == "__main__":
    main()
