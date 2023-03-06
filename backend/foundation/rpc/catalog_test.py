from collections.abc import Iterator
from dataclasses import fields, is_dataclass
from typing import Any, get_args, get_type_hints

from foundation.rpc.catalog import get_catalog

nl = "\n"


def get_child_dataclasses(d: type[Any]) -> Iterator[tuple[str, type[Any]]]:
    type_hints = get_type_hints(d)
    for f in fields(d):
        # Get the resolved type of every child.
        child = type_hints[f.name]
        # If the child is a dataclass, send it.
        if is_dataclass(child):
            yield f.name, child
            continue
        # If the type is e.g. list[Dataclass] or Union[Dataclass, None],
        # fetch the arguments of the type to search for a dataclass.
        child_args = get_args(child)
        for carg in child_args:
            if is_dataclass(carg):
                yield f.name, carg


def test_no_invalid_id_attribute_exposed() -> None:
    catalog = get_catalog()

    def check_dataclass_has_id_field(d: type[Any]) -> bool:
        for f in fields(d):
            if f.name == "id":
                return True
            for _, cd in get_child_dataclasses(d):
                if check_dataclass_has_id_field(cd):
                    return True
        return False

    invalid = []

    for route in catalog.rpcs:
        if route.in_ and check_dataclass_has_id_field(route.in_):
            invalid.append(f"{route.name} Input")  # pragma: no cover
        if route.out and check_dataclass_has_id_field(route.out):
            invalid.append(f"{route.name} Output")  # pragma: no cover
        for err in route.errors:
            if check_dataclass_has_id_field(err):
                invalid.append(f"{route.name}.{err.__name__} Error")  # pragma: no cover

    assert not invalid, f"""\
Do not expose the `id` field in {", ".join(invalid)}.
Outside of the backend, all entities must be referenced via their external id.
Failing models:
{nl.join([f"- {x}" for x in invalid])}
"""  # pragma: no cover
