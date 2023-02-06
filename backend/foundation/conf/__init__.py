import os

from dotenv import load_dotenv

load_dotenv()


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

    def _psycopg_database_url(self) -> str:
        user = os.environ["POSTGRES_USER"]
        password = os.environ["POSTGRES_PASSWORD"]
        host = os.environ["POSTGRES_HOST"]
        port = os.environ["POSTGRES_PORT"]
        return f"postgresql://{user}:{password}@{host}:{port}"

    def _yoyo_database_url(self) -> str:
        user = os.environ["POSTGRES_USER"]
        password = os.environ["POSTGRES_PASSWORD"]
        host = os.environ["POSTGRES_HOST"]
        port = os.environ["POSTGRES_PORT"]
        return f"postgresql+psycopg://{user}:{password}@{host}:{port}"

    def _pool_size(self) -> int:
        try:
            return int(os.environ.get("POOL_SIZE", 20))
        except ValueError as e:
            raise InvalidConfigValueError("Failed to parse POOL_SIZE to int.") from e

    def _session_secret(self) -> str:
        return os.environ["SESSION_SECRET"]


# Define a Config singleton.
confvars = _Config()
