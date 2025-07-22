import secrets

import coolname
from tsidpy import TSID

from database.__codegen__.tables import DatabaseTablePrefixEnum


def _pg_b58_encode(num: int) -> str:
    """Internal function, do NOT use outside of generate_id."""
    # This is the same as b58_encode UDF in Postgres.
    alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
    encoded = ""
    base = len(alphabet)

    while num >= base:
        divisor = num // base
        mod = num % base
        encoded = alphabet[mod] + encoded
        num = divisor

    encoded = alphabet[num] + encoded
    encoded = encoded.ljust(11, "1")
    return encoded


def generate_id(prefix: DatabaseTablePrefixEnum) -> str:
    b = TSID.create().to_bytes()
    num = int.from_bytes(b, "big")
    return f"{prefix}_{_pg_b58_encode(num)}"


def generate_shortcode(length: int = 6) -> str:
    return secrets.token_urlsafe(length)


def generate_slug(num_segments: int = 2) -> str:
    return coolname.generate_slug(num_segments)


def generate_name(num_segments: int = 2) -> str:
    return " ".join(x.capitalize() for x in coolname.generate(num_segments))


def generate_email() -> str:
    return "user@sunsetglow+" + generate_slug(2) + ".net"
