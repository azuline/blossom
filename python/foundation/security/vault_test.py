import pytest

from database.xact import xact_admin
from foundation.conftest import FoundationFixture
from foundation.security.vault import (
    SecretNotFoundError,
    delete_vaulted_secret,
    fetch_vaulted_secret,
    vault_secret,
)


async def test_vaulted_secrets(t: FoundationFixture) -> None:
    organization = await t.factory.organization()
    async with xact_admin() as q:
        # 1. Vault a secret.
        plaintext = "YELLOW SUBMARINE"
        vs = await vault_secret(q, organization.id, plaintext)
        # 2. Fetch the vaulted secret and ensure it decrypts to the correct plaintext value.
        recv = await fetch_vaulted_secret(q, organization.id, vs.id)
        assert recv == plaintext
        # 3. Delete the vaulted secret and assert that it can no longer be fetched.
        await delete_vaulted_secret(q, vs.id)
        with pytest.raises(SecretNotFoundError):
            await fetch_vaulted_secret(q, organization.id, vs.id)
