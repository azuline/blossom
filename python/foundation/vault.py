from database.access.xact import DBQuerier
from database.codegen.models import VaultedSecret
from foundation.crypt import decrypt_symmetric, encrypt_symmetric
from foundation.types import cast_notnull

Secret = str


async def vault_secret(q: DBQuerier, tenant_id: str, secret: Secret) -> VaultedSecret:
    """Encrypt and stores a tenant secret into the vault table."""
    ciphertext = encrypt_symmetric(secret, tenant_id.encode())
    return cast_notnull(await q.orm.vault_secret_create(tenant_id=tenant_id, ciphertext=ciphertext))


class SecretNotFoundError(Exception):
    pass


async def fetch_vaulted_secret(q: DBQuerier, tenant_id: str, secret_id: str) -> Secret:
    """Fetch and decrypt a secret from the vault table."""
    if vs := await q.orm.vault_secret_fetch(id=secret_id):
        return decrypt_symmetric(vs.ciphertext, tenant_id.encode())
    raise SecretNotFoundError


async def delete_vaulted_secret(q: DBQuerier, secret_id: int) -> None:
    """Delete a secret from the vault table."""
    await q.orm.vault_secret_delete(id=secret_id)
