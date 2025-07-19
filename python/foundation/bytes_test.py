from foundation.bytes import int_to_bytes


def test_int_to_bytes_positive():
    assert int_to_bytes(1024) == b"\x04\x00"


def test_int_to_bytes_zero():
    assert int_to_bytes(0) == b""
