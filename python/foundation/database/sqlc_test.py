import re
from pathlib import Path

from foundation.root import BACKEND_ROOT

QUERY_NAME_REGEX = re.compile(r"^-- name: ([^ ]+)")

nl = "\n"


def test_sqlc_query_prefixes() -> None:
    failed: list[str] = []

    root = Path(BACKEND_ROOT)
    for qf_name in root.glob("**/queries.sql"):
        qf = Path(qf_name)
        package = qf.parent.name

        with qf.open("r") as fptr:
            lines = fptr.readlines()

        for line in lines:
            m = QUERY_NAME_REGEX.match(line)
            if not m:
                continue

            query_name = m[1].lower()
            if (
                not query_name.startswith(package)
                # Allow test to be prefixed with Test. Same for all other zlibs.
                and not query_name.startswith(package.removeprefix("z"))
                # Allow for unpluralized prefixes.
                and not query_name.startswith(package.removesuffix("s"))
                and not query_name.startswith(package.removesuffix("es"))
            ):
                failed.append(f"{qf_name}:{query_name}")  # pragma: no cover

    assert not failed, f"""\
The following queries should be prefixed with their package name:

{nl.join([f"- {x}" for x in failed])}
"""  # pragma: no cover
