"""
Notes on our crypto:

- We are using ChaCha20Poly1305 for symmetric AEAD, which is excellent except for the fact that its
  nonces are only 96 bits. Reuse of a nonce with the same key breaks the security of the cipher, so
  all nonces must be unique. Since we are randomly generating nonces, this creates problems due to
  the birthday paradox. It is plausible to chance upon a nonce collision after a certain volume of
  encryptions, which breaks the security of the cipher. Ideally, we would use XSalsa20, but it is
  not part of the super-convenient cryptography library. Keep this in mind if we ever reach
  hyperscale.
"""

import base64
import secrets

from cryptography.exceptions import InvalidTag
from cryptography.hazmat.primitives.ciphers.aead import ChaCha20Poly1305

from foundation.env import ENV
from foundation.errors import BaseError


def random_b64(length: int) -> str:
    return base64.b64encode(secrets.token_bytes(length)).decode("utf-8")[:length]


def encrypt_symmetric(data: str, associated_data: bytes | None = None, *, encryption_key: bytes = ENV.vault_encryption_key) -> str:
    cipher = ChaCha20Poly1305(encryption_key)
    nonce = secrets.token_bytes(12)  # Meh, birthday paradox :(
    plaintext = data.encode()
    # Note: Can raise OverflowError if data is larger than 2^31-1 bytes.
    ciphertext = cipher.encrypt(nonce, plaintext, associated_data)
    return base64.b64encode(nonce + ciphertext).decode("utf-8")


class DecryptionFailedError(BaseError):
    pass


def decrypt_symmetric(data: str, associated_data: bytes | None = None, *, encryption_key: bytes = ENV.vault_encryption_key) -> str:
    session_bytes = base64.b64decode(data)
    nonce, ciphertext = session_bytes[:12], session_bytes[12:]
    cipher = ChaCha20Poly1305(encryption_key)
    try:
        plaintext = cipher.decrypt(nonce, ciphertext, associated_data)
    except InvalidTag as e:
        raise DecryptionFailedError("failed to decrypt ciphertext") from e
    return plaintext.decode()
