import dataclasses
import json
import secrets
from collections.abc import AsyncIterator, Iterator
from typing import Any

import pytest
import pytest_asyncio

from foundation.env import ENV
from foundation.external.external import EXT
from foundation.external.openai import DEFAULT_LLM_CACHE_DIR, COpenAI, FakeOpenAIClient
from foundation.external.sheets import CSheets, FakeGoogleSheetsService
from foundation.external.slack import CSlack, FakeSlackClient
from foundation.logs import get_logger
from foundation.testing.testdb import TestDB

logger = get_logger()


@pytest_asyncio.fixture(autouse=True, scope="session", loop_scope="session")
async def test_db(request: pytest.FixtureRequest) -> AsyncIterator[None]:
    """Create a test database for the entire test session."""
    original_database_uri = ENV.database_uri

    logger.info("creating test database for session")
    testdb = TestDB()
    test_db_name = await testdb.create_db()
    ENV.database_uri = testdb.database_uri(test_db_name)
    logger.info("created test database for session", database_uri=ENV.database_uri)

    try:
        yield
    finally:
        ENV.database_uri = original_database_uri
        if request.session.testsfailed > 0:
            logger.error("test session failed: database preserved for debugging", test_database_uri=ENV.database_uri, test_db_name=test_db_name)
            print("=" * 80)  # noqa: T201
            print("TEST DATABASE PRESERVED FOR DEBUGGING")  # noqa: T201
            print(f"$ psql {ENV.database_uri}")  # noqa: T201
            print("=" * 80)  # noqa: T201
        else:
            logger.info("test session passed: cleaning up test database", db_name=test_db_name)
            await testdb.drop_db(test_db_name)


@pytest.fixture(autouse=True, scope="session")
def clear_llmcache_locks() -> None:
    # Maybe left over from a previous test run.
    if DEFAULT_LLM_CACHE_DIR.exists():
        for f in DEFAULT_LLM_CACHE_DIR.iterdir():
            if f.suffix == ".lock":
                f.unlink()


@pytest.fixture(autouse=True)
def fake_settings(request: pytest.FixtureRequest) -> Iterator[None]:
    ENV.testing = True

    if "live" in request.keywords:
        yield
        return

    fields = {
        "slack_token": "test-slack-token",
        "slack_signing_secret": secrets.token_urlsafe(16),
        "google_sheets_credentials_json": json.dumps({
            "type": "service_account",
            "project_id": "test-project",
            "private_key_id": "test-key-id",
            "private_key": "-----BEGIN RSA PRIVATE KEY-----\nMIIBOgIBAAJBAKx1c7RR7R/drnBSQ/zfx1vQLHUbFLh1ZFHK5C3GKZP9Dqb\nMIIBOgIBAAJBAKx1c7RR7R\n-----END RSA PRIVATE KEY-----",
            "client_email": "test@test-project.iam.gserviceaccount.com",
            "client_id": "123456789",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/test%40test-project.iam.gserviceaccount.com",
        }),
        # Disable Sentry in tests to avoid sending test errors
        "sentry_dsn": None,
    }

    originals: dict[str, Any] = {}
    for k, v in fields.items():
        assert hasattr(ENV, k)
        originals[k] = getattr(ENV, k)
        setattr(ENV, k, v)
    yield
    for k, v in originals.items():
        setattr(ENV, k, v)


@pytest.fixture(autouse=True)
def fake_ext(request: pytest.FixtureRequest) -> Iterator[None]:
    if "live" in request.keywords:
        yield
        return

    EXT.test_openai = COpenAI(_fake_client=FakeOpenAIClient())
    EXT.test_slack = CSlack(_fake_client=FakeSlackClient())
    EXT.test_google_sheets = CSheets(_fake_service=FakeGoogleSheetsService())

    yield

    for f in dataclasses.fields(EXT):
        if f.name.startswith("test_"):
            setattr(EXT, f.name, None)
