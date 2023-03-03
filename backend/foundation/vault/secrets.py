import secrets

from cryptography.hazmat.primitives.ciphers.aead import ChaCha20Poly1305

from codegen.sqlc.models import VaultedSecret
from foundation.config import confvars
from foundation.database import ConnQuerier
from foundation.std.bytes import int_to_bytes

NONCE_LENGTH = 12
Secret = str


async def vault_secret(cq: ConnQuerier, tenant_id: int, secret: Secret) -> VaultedSecret:
    """
    vault_secret encrypts and stores a tenant secret into the vault table and
    returns the created vault entry.
    """
    cipher = ChaCha20Poly1305(confvars.vault_encryption_key)
    nonce = secrets.token_bytes(NONCE_LENGTH)
    ciphertext = cipher.encrypt(
        nonce=nonce,
        data=secret.encode(),
        # Authenticate the secret with the tenant ID so that secrets can only be decrypted when
        # operating under the same tenant that the secret was encrypted by.
        associated_data=int_to_bytes(tenant_id),
    )
    vs = await cq.q.vault_create_secret(
        tenant_id=tenant_id,
        ciphertext=ciphertext.hex(),
        nonce=nonce.hex(),
    )
    assert vs is not None
    return vs


class SecretNotFoundError(Exception):
    pass


async def fetch_vaulted_secret(cq: ConnQuerier, tenant_id: int, secret_id: int) -> Secret:
    """
    fetch_vaulted_secret fetches and decrypts a secret from the vault table.

    :raises SecretNotFoundError:
    """
    vs = await cq.q.vault_fetch_secret(id=secret_id)
    if vs is None:
        raise SecretNotFoundError()

    cipher = ChaCha20Poly1305(confvars.vault_encryption_key)
    plaintext = cipher.decrypt(
        nonce=bytes.fromhex(vs.nonce),
        data=bytes.fromhex(vs.ciphertext),
        associated_data=int_to_bytes(tenant_id),
    )
    return plaintext.decode()
