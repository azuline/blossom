from database.__codegen__ import models
from database.xact import DBQuerier
from foundation.crypto.crypt import decrypt_symmetric, encrypt_symmetric
from foundation.observability.errors import BaseError
from foundation.stdlib.convert import cast_notnull

type Secret = str


async def vault_secret(q: DBQuerier, organization_id: str, secret: Secret) -> models.VaultedSecret:
    """Encrypt and stores a organization secret into the vault table."""
    ciphertext = encrypt_symmetric(secret, organization_id.encode())
    return cast_notnull(await q.orm.vault_secret_create(organization_id=organization_id, ciphertext=ciphertext))


class SecretNotFoundError(BaseError):
    pass


async def fetch_vaulted_secret(q: DBQuerier, organization_id: str, secret_id: str) -> Secret:
    """Fetch and decrypt a secret from the vault table."""
    if vs := await q.orm.vault_secret_fetch(id=secret_id):
        return decrypt_symmetric(vs.ciphertext, organization_id.encode())
    raise SecretNotFoundError


async def delete_vaulted_secret(q: DBQuerier, secret_id: str) -> None:
    """Delete a secret from the vault table."""
    await q.orm.vault_secret_delete(id=secret_id)
