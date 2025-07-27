import pytest

from database.xact import xact_admin
from foundation.conftest import FoundationFixture
from foundation.crypto.vault import (
    delete_vaulted_secret,
    fetch_vaulted_secret,
    vault_secret,
)
from foundation.observability.errors import NotFoundError


async def test_vaulted_secrets(t: FoundationFixture) -> None:
    organization = await t.factory.organization()
    async with xact_admin() as conn:
        # 1. Vault a secret.
        plaintext = "YELLOW SUBMARINE"
        vs = await vault_secret(conn, organization.id, plaintext)
        # 2. Fetch the vaulted secret and ensure it decrypts to the correct plaintext value.
        recv = await fetch_vaulted_secret(conn, organization.id, vs.id)
        assert recv == plaintext
        # 3. Delete the vaulted secret and assert that it can no longer be fetched.
        await delete_vaulted_secret(conn, vs.id)
        with pytest.raises(NotFoundError):
            await fetch_vaulted_secret(conn, organization.id, vs.id)
