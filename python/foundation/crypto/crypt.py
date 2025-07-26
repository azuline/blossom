import base64
import secrets

from Crypto.Cipher import ChaCha20_Poly1305

from foundation.env import ENV
from foundation.observability.errors import BaseError


def random_b64(length: int) -> str:
    return base64.b64encode(secrets.token_bytes(length)).decode("utf-8")[:length]


def encrypt_symmetric(data: str, associated_data: bytes | None = None, *, encryption_key: bytes = ENV.vault_encryption_key) -> str:
    # A 24-byte nonce makes this XChaCha20-Poly1305, which is not weak to the birthday paradox. With
    # ChaCha20-Poly1305's default 12-byte nonce, we can only encrypt ~13 biliion ciphertexts per key
    # before risking nonce reuse.
    nonce = secrets.token_bytes(24)
    cipher = ChaCha20_Poly1305.new(key=encryption_key, nonce=nonce)
    if associated_data:
        cipher.update(associated_data)
    plaintext = data.encode()
    # Note: Can raise OverflowError if data is larger than 2^31-1 bytes.
    ciphertext, tag = cipher.encrypt_and_digest(plaintext)
    return base64.b64encode(nonce).decode("utf-8") + ":" + base64.b64encode(tag).decode("utf-8") + ":" + base64.b64encode(ciphertext).decode("utf-8")


class DecryptionFailedError(BaseError):
    pass


def decrypt_symmetric(data: str, associated_data: bytes | None = None, *, encryption_key: bytes = ENV.vault_encryption_key) -> str:
    try:
        nonce_s, tag_s, ciphertext_s = data.split(":")
    except ValueError as e:
        raise DecryptionFailedError("failed to split encrypted data into nonce, tag, and ciphertext by colon") from e
    nonce, tag, ciphertext = base64.b64decode(nonce_s), base64.b64decode(tag_s), base64.b64decode(ciphertext_s)
    cipher = ChaCha20_Poly1305.new(key=encryption_key, nonce=nonce)
    if associated_data:
        cipher.update(associated_data)
    try:
        plaintext = cipher.decrypt_and_verify(ciphertext, tag)
    except ValueError as e:
        raise DecryptionFailedError("failed to decrypt ciphertext") from e
    return plaintext.decode()
