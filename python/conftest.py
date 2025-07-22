import dataclasses
import json
import secrets
from collections.abc import AsyncIterator, Iterator
from typing import Any

import pytest
import pytest_asyncio

from database.testdb import TestDB
from foundation.env import ENV
from foundation.errors import TESTING_CAPTURED_EXCEPTIONS
from foundation.external.external import EXT
from foundation.external.openai import COpenAI, FakeOpenAIClient
from foundation.external.sheets import CSheets, FakeGoogleSheetsService
from foundation.external.slack import CSlack, FakeSlackClient
from foundation.initialize import initialize_foundation
from foundation.logs import get_logger

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
        if request.session.testsfailed > 0:
            print("TEST DATABASE PRESERVED FOR DEBUGGING. CONNECT WITH:")  # noqa: T201
            print(f"$ psql {ENV.database_uri}")  # noqa: T201
            ENV.database_uri = original_database_uri
        else:
            logger.info("test session passed: cleaning up test database", db_name=test_db_name)
            ENV.database_uri = original_database_uri
            await testdb.drop_db(test_db_name)


@pytest.fixture(autouse=True)
def clear_globals_function() -> None:
    TESTING_CAPTURED_EXCEPTIONS.clear()


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


@pytest.fixture(autouse=True)
def initialize(fake_settings) -> None:
    del fake_settings
    initialize_foundation()
