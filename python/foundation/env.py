from __future__ import annotations

import dataclasses
import os
from typing import Literal, cast, get_args

from dotenv import dotenv_values

env: dict[str, str] = {
    **dotenv_values(".env"),  # type: ignore
    # The is not committed to git and contains sensitive overrides for development.
    **dotenv_values(".env.local"),  # type: ignore
}

# Quart auto-loads .env into os.environ when dotenv is installed, so we will override .env.local
# if we load in os.envion. However, in Production, we always want os.environ to be at the end.
if os.environ.get("QUART_DEBUG", 0) != "1":  # pragma: no cover
    env = {**env, **os.environ}
# Remove os.environ from scope so that it doesn't accidentally get used.
del os


class EnvironmentVariableMissingError(Exception):
    pass


class InvalidConfigValueError(Exception):
    pass


EnvironmentEnum = Literal["production", "development"]
ServiceEnum = Literal["product", "panopticon", "pipeline"]


@dataclasses.dataclass
class _Env:
    environment: EnvironmentEnum
    service: ServiceEnum
    commit: str
    testing: bool

    # Service references.
    database_uri: str

    # Infra parameters.
    sentry_dsn: str | None

    # Configuration parameters (w/ defaults).
    database_pool_size: int
    eval_concurrency: int

    # First-party secrets.
    vault_encryption_key: bytes

    # Third-party API keys.
    slack_token: str | None
    slack_signing_secret: str | None
    openai_api_key: str
    google_sheets_credentials_json: str | None

    # Integrations
    brex_token: str | None
    ramp_token: str | None

    @classmethod
    def initialize(cls) -> _Env:
        c = cls(
            environment=cast(EnvironmentEnum, cls._required("ENVIRONMENT")),
            service=cast(ServiceEnum, cls._optional("SERVICE")),
            testing=bool(cls._optional("TESTING") or False),
            commit=cls._optional("RENDER_GIT_COMMIT") or "development",
            database_uri=cls._required("DATABASE_URI"),
            sentry_dsn=cls._optional("SENTRY_DSN"),
            database_pool_size=int(cls._optional("DATABASE_POOL_SIZE") or 5),
            eval_concurrency=int(cls._optional("EVAL_CONCURRENCY") or 25),
            vault_encryption_key=bytes.fromhex(cls._required("VAULT_ENCRYPTION_KEY")),
            slack_token=cls._optional("SLACK_TOKEN"),
            slack_signing_secret=cls._optional("SLACK_SIGNING_SECRET"),
            openai_api_key=cls._required("OPENAI_API_KEY"),
            google_sheets_credentials_json=cls._optional("GOOGLE_SHEETS_CREDENTIALS_JSON"),
            brex_token=cls._optional("BREX_TOKEN"),
            ramp_token=cls._optional("RAMP_TOKEN"),
        )
        assert c.environment in get_args(EnvironmentEnum), f"ENVIRONMENT is invalid: {c.environment} not one of {', '.join(get_args(EnvironmentEnum))}"
        assert c.service is None or c.service in get_args(ServiceEnum), f"SERVICE is invalid: {c.service} not one of {', '.join(get_args(ServiceEnum))}"
        return c

    @staticmethod
    def _optional(key: str) -> str | None:
        return env.get(key)

    @staticmethod
    def _required(key: str) -> str:
        try:
            return env[key]
        except KeyError as e:
            raise EnvironmentVariableMissingError from e


ENV = _Env.initialize()
