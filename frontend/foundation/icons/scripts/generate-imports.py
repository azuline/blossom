#!/usr/bin/env python

"""
This script takes the icons in `codegen/icons` and generates a mapping of icon name to lazy imports.
The list is written to `codegen/imports.ts.
"""

from pathlib import Path

icons_dir = Path(__file__).resolve().parent.parent / "src" / "codegen" / "icons"


def indent(s: str, i: int) -> str:
    return "\n".join(["  " * i + sl for sl in s.splitlines()])


icons = [
    (
        i.stem.removeprefix("_x-icon-"),
        str(i.resolve().with_suffix("")).removeprefix(str(icons_dir) + "/"),
    )
    for i in icons_dir.glob("**/*.tsx")
]
record_lines = [
    indent(f'"{stem}": lazy(() => import("./icons/{path}")),', 1) for stem, path in icons
]

nl = "\n"
contents = f"""\
/* dprint-ignore-file */
/* eslint-disable */
import {{ FC, lazy, LazyExoticComponent }} from "react";

export const ICONS_MAP: Record<string, LazyExoticComponent<FC>> = {{
{nl.join(record_lines)}
}} as const;
"""

out_file = Path(__file__).parent.parent / "src" / "codegen" / "imports.ts"
with out_file.open("w") as fp:
    fp.write(contents)
