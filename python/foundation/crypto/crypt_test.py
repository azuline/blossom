import pytest

from foundation.crypto.crypt import DecryptionFailedError, decrypt_symmetric, encrypt_symmetric, random_b64


def test_crypt() -> None:
    plaintext = "YELLOW SUBMARINE"

    # Test without associated data.
    associated_data = None
    ciphertext = encrypt_symmetric(plaintext, associated_data)
    assert decrypt_symmetric(ciphertext, associated_data) == plaintext

    # Test with associated data.
    associated_data = b"hanni pham"
    ciphertext = encrypt_symmetric(plaintext, associated_data)
    assert decrypt_symmetric(ciphertext, associated_data) == plaintext

    # Test with incorrect associated data.
    with pytest.raises(DecryptionFailedError):
        decrypt_symmetric(ciphertext, b"kim minji")
    with pytest.raises(DecryptionFailedError):
        decrypt_symmetric(ciphertext, None)


def test_random_b64() -> None:
    assert len(random_b64(16)) == 16
    assert len(random_b64(32)) == 32
    assert len(random_b64(64)) == 64
