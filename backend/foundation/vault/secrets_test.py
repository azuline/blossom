import pytest

from foundation.test.fixture import TFix
from foundation.vault.secrets import fetch_vaulted_secret, vault_secret


@pytest.mark.asyncio
async def test_vaulted_secrets(t: TFix) -> None:
    tenant = await t.f.tenant()
    plaintext = "YELLOW SUBMARINE"
    cq = await t.db.conn_admin()
    vs = await vault_secret(cq, tenant.id, plaintext)
    recv = await fetch_vaulted_secret(cq, tenant.id, vs.id)
    assert recv == plaintext
