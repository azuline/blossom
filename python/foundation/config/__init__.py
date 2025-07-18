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
if os.environ.get("QUART_DEBUG", 0) != "1":  # pragma: no cover
    env = {**env, **os.environ}
# Remove os.environ from scope so that it doesn't accidentally get used.
del os


class InvalidConfigValueError(Exception):
    pass


class _Config:
    def __init__(self) -> None:
        # Parse all config values at application startup. This way we do not have an
        # unexpected config parse error at runtime.
        self.database_url = self.__database_url()
        self.pool_size = self.__pool_size()
        self.session_secret = self.__session_secret()
        self.vault_encryption_key = self.__vault_encryption_key()
        self.app_url = self.__app_url()

    def __database_url(self) -> str:
        user = env["POSTGRES_USER"]
        password = env["POSTGRES_PASSWORD"]
        host = env["POSTGRES_HOST"]
        port = env["POSTGRES_PORT"]
        return f"postgresql://{user}:{password}@{host}:{port}"

    def __pool_size(self) -> int:
        try:
            return int(env.get("POOL_SIZE", 20))
        except ValueError as e:  # pragma: no cover
            raise InvalidConfigValueError("Failed to parse POOL_SIZE to int.") from e

    def __session_secret(self) -> str:
        return env["SESSION_SECRET"]

    def __vault_encryption_key(self) -> bytes:
        return bytes.fromhex(env["VAULT_ENCRYPTION_KEY"])

    def __app_url(self) -> str:
        return env["APP_URL"]


# Define a Config singleton.
CONFVARS = _Config()
