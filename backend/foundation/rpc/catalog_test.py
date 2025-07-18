from collections.abc import Iterator
from dataclasses import fields, is_dataclass
from typing import Any, get_args, get_type_hints


def get_child_dataclasses(d: type[Any]) -> Iterator[tuple[str, type[Any]]]:
    type_hints = get_type_hints(d)
    for f in fields(d):
        # Get the resolved type of every child.
        child = type_hints[f.name]
        # If the child is a dataclass, send it.
        if is_dataclass(child) and isinstance(child, type):
            yield f.name, child
            continue
        # If the type is e.g. list[Dataclass] or Union[Dataclass, None],
        # fetch the arguments of the type to search for a dataclass.
        child_args = get_args(child)
        for carg in child_args:
            if is_dataclass(carg) and isinstance(carg, type):
                yield f.name, carg
