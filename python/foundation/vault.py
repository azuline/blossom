import secrets

from cryptography.hazmat.primitives.ciphers.aead import ChaCha20Poly1305
from database.codegen.models import VaultedSecret

from database.access.xact import DBQuerier
from foundation.bytes import int_to_bytes
from foundation.env import ENV

NONCE_LENGTH = 12
Secret = str


async def vault_secret(q: DBQuerier, tenant_id: int, secret: Secret) -> VaultedSecret:
    """
    vault_secret encrypts and stores a tenant secret into the vault table and
    returns the created vault entry.
    """
    cipher = ChaCha20Poly1305(ENV.vault_encryption_key)
    nonce = secrets.token_bytes(NONCE_LENGTH)
    # Authenticate the secret with the tenant ID so that secrets can only be decrypted when
    # operating under the same tenant that the secret was encrypted by.
    ciphertext = cipher.encrypt(nonce=nonce, data=secret.encode(), associated_data=int_to_bytes(tenant_id))
    vs = await q.orm.vault_create_secret(tenant_id=tenant_id, ciphertext=ciphertext.hex(), nonce=nonce.hex())
    assert vs is not None
    return vs


class SecretNotFoundError(Exception):
    pass


async def fetch_vaulted_secret(q: DBQuerier, tenant_id: int, secret_id: int) -> Secret:
    """
    fetch_vaulted_secret fetches and decrypts a secret from the vault table.
    """
    vs = await q.orm.vault_fetch_secret(id=secret_id)
    if vs is None:
        raise SecretNotFoundError

    cipher = ChaCha20Poly1305(ENV.vault_encryption_key)
    plaintext = cipher.decrypt(
        nonce=bytes.fromhex(vs.nonce),
        data=bytes.fromhex(vs.ciphertext),
        associated_data=int_to_bytes(tenant_id),
    )
    return plaintext.decode()


async def delete_vaulted_secret(q: DBQuerier, secret_id: int) -> None:
    """
    delete_vaulted_secret deletes an encrypted secret.
    """
    await q.orm.vault_delete_secret(id=secret_id)
