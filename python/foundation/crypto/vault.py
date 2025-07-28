from database.__codegen_db__.models import VaultedSecretModel
from database.conn import DBConn
from foundation.crypto.__codegen_db__.queries import query_vault_secret_create, query_vault_secret_delete, query_vault_secret_fetch
from foundation.crypto.crypt import decrypt_symmetric, encrypt_symmetric

type Secret = str


async def vault_secret(conn: DBConn, organization_id: str, secret: Secret) -> VaultedSecretModel:
    """Encrypt and stores a organization secret into the vault table."""
    ciphertext = encrypt_symmetric(secret, organization_id.encode())
    return await query_vault_secret_create(conn, organization_id=organization_id, ciphertext=ciphertext)


async def fetch_vaulted_secret(conn: DBConn, organization_id: str, secret_id: str) -> Secret:
    """Fetch and decrypt a secret from the vault table."""
    vs = await query_vault_secret_fetch(conn, id=secret_id)
    return decrypt_symmetric(vs.ciphertext, organization_id.encode())


async def delete_vaulted_secret(conn: DBConn, secret_id: str) -> None:
    """Delete a secret from the vault table."""
    await query_vault_secret_delete(conn, id=secret_id)
