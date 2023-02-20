import os

from dotenv import dotenv_values

env: dict[str, str] = {
    # This is committed to git and contains non-sensitive keys.
    **dotenv_values(".env"),  # type: ignore
    # The is not committed to git and contains sensitive overrides.
    **dotenv_values(".env.local"),  # type: ignore
}

# Quart auto-loads .env into os.environ when dotenv is installed, so we will override .env.local
# if we load in os.envion. However, in Production, we always want os.environ to be at the end.
if os.environ.get("QUART_DEBUG", 0) != "1":
    env = {**env, **os.environ}
# Remove os.environ from scope so that it doesn't accidentally get used.
del os


class InvalidConfigValueError(Exception):
    pass


class _Config:
    def __init__(self) -> None:
        # Parse all config values at application startup. This way we do not have an
        # unexpected config parse error at runtime.
        self.psycopg_database_url = self._psycopg_database_url()
        self.yoyo_database_url = self._yoyo_database_url()
        self.pool_size = self._pool_size()
        self.session_secret = self._session_secret()
        self.app_url = self._app_url()

    def _psycopg_database_url(self) -> str:
        user = env["POSTGRES_USER"]
        password = env["POSTGRES_PASSWORD"]
        host = env["POSTGRES_HOST"]
        port = env["POSTGRES_PORT"]
        return f"postgresql://{user}:{password}@{host}:{port}"

    def _yoyo_database_url(self) -> str:
        user = env["POSTGRES_USER"]
        password = env["POSTGRES_PASSWORD"]
        host = env["POSTGRES_HOST"]
        port = env["POSTGRES_PORT"]
        return f"postgresql+psycopg://{user}:{password}@{host}:{port}"

    def _pool_size(self) -> int:
        try:
            return int(env.get("POOL_SIZE", 20))
        except ValueError as e:
            raise InvalidConfigValueError("Failed to parse POOL_SIZE to int.") from e

    def _session_secret(self) -> str:
        return env["SESSION_SECRET"]

    def _app_url(self) -> str:
        return env["APP_URL"]


# Define a Config singleton.
confvars = _Config()
