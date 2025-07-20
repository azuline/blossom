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
    """Run the panopticon web application backend devserver."""
    os.environ["QUART_DEBUG"] = "1"
    os.environ["QUART_APP"] = "panopticon.app:create_app()"
    os.environ["QUART_SKIP_DOTENV"] = "1"  # We handle it ourselves.
    os.environ["SERVICE"] = "panopticon"
    subprocess.run(["quart", "run", "--port", str(ENV.panopticon_port)], check=True)


@main.command()
def webserver():
    """Run the panopticon web application backend panopticonion webserver."""
    if not ENV.panopticon_host:
        raise ConfigurationError("PANOPTICON_HOST environment variable not set")
    if not ENV.panopticon_port:
        raise ConfigurationError("PANOPTICON_PORT environment variable not set")
    start_webserver("panopticon.app:create_app()", ENV.panopticon_host, ENV.panopticon_port)


if __name__ == "__main__":
    main()
