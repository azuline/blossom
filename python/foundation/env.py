from __future__ import annotations

import dataclasses
import os
import sys
from typing import Literal, cast, get_args

from dotenv import dotenv_values


def initialize_env() -> None:
    # TODO: Don't load in global scope.
    pass


defaults = {}
if os.getenv("ENVIRONMENT") != "production":
    defaults = dotenv_values(".env.example")

env: dict[str, str] = {
    **defaults,  # type: ignore
    # The is not committed to git and contains sensitive overrides for development.
    **dotenv_values(".env.local"),  # type: ignore
    **os.environ,
}


class EnvironmentVariableMissingError(Exception):
    pass


type EnvironmentEnum = Literal["production", "development"]
type LogLevelEnum = Literal["debug", "info"]
type ServiceEnum = Literal["product", "panopticon", "pipeline", "development"]


@dataclasses.dataclass(slots=True)
class _Env:
    environment: EnvironmentEnum
    log_level: LogLevelEnum
    service: ServiceEnum
    version: str
    testing: bool

    # Service references.
    database_uri: str
    # - Product
    product_host: str | None
    product_port: int | None
    product_public_url: str
    # - Panopticon
    panopticon_host: str | None
    panopticon_port: int | None
    panopticon_public_url: str
    # - Pipeline
    pipeline_host: str | None
    pipeline_port: int | None
    pipeline_public_url: str

    # Infra parameters.
    sentry_dsn: str | None
    datadog_enabled: bool
    datadog_agent_host: str | None
    datadog_api_key: str | None

    # Configuration parameters (w/ defaults).
    webserver_num_workers: int
    database_pool_min_size: int
    database_pool_max_size: int
    eval_concurrency: int

    # First-party secrets.
    quart_session_key: str
    vault_encryption_key: bytes

    # Third-party API keys.
    slack_token: str | None
    slack_signing_secret: str | None
    openai_api_key: str | None
    google_sheets_credentials_json: str | None

    # Integrations
    brex_token: str | None
    ramp_token: str | None

    @classmethod
    def initialize(cls) -> _Env:
        c = cls(
            environment=cast(EnvironmentEnum, cls._required("ENVIRONMENT")),
            log_level=cast(LogLevelEnum, cls._optional("LOG_LEVEL") or "info"),
            service=cast(ServiceEnum, cls._optional("SERVICE") or "development"),
            testing="pytest" in sys.modules,
            version="development",  # TODO: dependent on infra provider
            database_uri=cls._required("DATABASE_URI"),
            sentry_dsn=cls._optional("SENTRY_DSN"),
            datadog_enabled=cls._optional("DD_TRACE_ENABLED") != "false",
            datadog_agent_host=cls._optional("DD_AGENT_HOST"),
            datadog_api_key=cls._optional("DD_API_KEY"),
            product_host=cls._optional("PRODUCT_HOST"),
            product_port=int(x) if (x := cls._optional("PRODUCT_PORT")) else None,
            product_public_url=cls._required("PRODUCT_PUBLIC_URL"),
            panopticon_host=cls._optional("PANOPTICON_HOST"),
            panopticon_port=int(x) if (x := cls._optional("PANOPTICON_PORT")) else None,
            panopticon_public_url=cls._required("PANOPTICON_PUBLIC_URL"),
            pipeline_host=cls._optional("PIPELINE_HOST"),
            pipeline_port=int(x) if (x := cls._optional("PIPELINE_PORT")) else None,
            pipeline_public_url=cls._required("PIPELINE_PUBLIC_URL"),
            webserver_num_workers=int(cls._optional("WEBSERVER_NUM_WORKERS") or 2),
            database_pool_min_size=int(cls._optional("DATABASE_POOL_MIN_SIZE") or 5),
            database_pool_max_size=int(cls._optional("DATABASE_POOL_MAX_SIZE") or 25),
            eval_concurrency=int(cls._optional("EVAL_CONCURRENCY") or 25),
            quart_session_key=cls._required("QUART_SESSION_KEY"),
            vault_encryption_key=bytes.fromhex(cls._required("VAULT_ENCRYPTION_KEY")),
            slack_token=cls._optional("SLACK_TOKEN"),
            slack_signing_secret=cls._optional("SLACK_SIGNING_SECRET"),
            openai_api_key=cls._optional("OPENAI_API_KEY"),
            google_sheets_credentials_json=cls._optional("GOOGLE_SHEETS_CREDENTIALS_JSON"),
            brex_token=cls._optional("BREX_TOKEN"),
            ramp_token=cls._optional("RAMP_TOKEN"),
        )
        assert c.environment in get_args(EnvironmentEnum), f"ENVIRONMENT is invalid: {c.environment} not one of {', '.join(get_args(EnvironmentEnum))}"
        assert c.log_level in get_args(LogLevelEnum), f"LOG_LEVEL is invalid: {c.log_level} not one of {', '.join(get_args(LogLevelEnum))}"
        assert c.service in get_args(ServiceEnum), f"SERVICE is invalid: {c.service} not one of {', '.join(get_args(ServiceEnum))}"
        assert c.service != "development" or c.environment == "development", "SERVICE is invalid: must be set in production and value must not be `development`"
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
