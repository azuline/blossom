import pytest

from foundation.test.fixture import TFix
from foundation.vault.secrets import (
    SecretNotFoundError,
    delete_vaulted_secret,
    fetch_vaulted_secret,
    vault_secret,
)


async def test_vaulted_secrets(t: TFix) -> None:
    tenant = await t.f.tenant()
    cq = await t.db.conn_admin()
    # 1. Vault a secret.
    plaintext = "YELLOW SUBMARINE"
    vs = await vault_secret(cq, tenant.id, plaintext)
    # 2. Fetch the vaulted secret and ensure it decrypts to the correct plaintext value.
    recv = await fetch_vaulted_secret(cq, tenant.id, vs.id)
    assert recv == plaintext
    # 3. Delete the vaulted secret and assert that it can no longer be fetched.
    await delete_vaulted_secret(cq, vs.id)
    with pytest.raises(SecretNotFoundError):
        await fetch_vaulted_secret(cq, tenant.id, vs.id)
