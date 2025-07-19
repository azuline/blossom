from database.access.xact import DBQuerier
from database.codegen.models import VaultedSecret
from foundation.crypt import decrypt_symmetric, encrypt_symmetric
from foundation.types import cast_notnull

Secret = str


async def vault_secret(q: DBQuerier, organization_id: str, secret: Secret) -> VaultedSecret:
    """Encrypt and stores a organization secret into the vault table."""
    ciphertext = encrypt_symmetric(secret, organization_id.encode())
    return cast_notnull(await q.orm.vault_secret_create(organization_id=organization_id, ciphertext=ciphertext))


class SecretNotFoundError(Exception):
    pass


async def fetch_vaulted_secret(q: DBQuerier, organization_id: str, secret_id: str) -> Secret:
    """Fetch and decrypt a secret from the vault table."""
    if vs := await q.orm.vault_secret_fetch(id=secret_id):
        return decrypt_symmetric(vs.ciphertext, organization_id.encode())
    raise SecretNotFoundError


async def delete_vaulted_secret(q: DBQuerier, secret_id: str) -> None:
    """Delete a secret from the vault table."""
    await q.orm.vault_secret_delete(id=secret_id)
