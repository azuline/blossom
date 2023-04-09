#!/usr/bin/env python

"""
This script transforms the svgs in `svgs/` into React components in `codegen/components`.

Changes:
1. Change width/height of SVGs to 100%, so that we can control width and height with a parent
   component.
2. Update svgs to React components.
"""

import re
import shutil
from pathlib import Path

icons_dir = Path(__file__).parent.parent / "svgs"
output_dir = Path(__file__).parent.parent / "src" / "codegen" / "icons"
shutil.rmtree(output_dir)
output_dir.mkdir(exist_ok=True, parents=True)


def indent(s: str, i: int) -> str:
    return "\n".join(["  " * i + sl for sl in s.splitlines()])


for f in icons_dir.glob("**/*.svg"):
    iset = f.parent.name
    print(f"Handling icon {f.name} of set {iset}")
    with f.open("r") as fp:
        contents = fp.read()

    # Changing common DOM properties.
    contents = re.sub(r"stroke-linejoin", "strokeLinejoin", contents)
    contents = re.sub(r"stroke-width", "strokeWidth", contents)
    contents = re.sub(r"stroke-linecap", "strokeLinecap", contents)

    # Per-set changes.
    if iset == "feather":
        # Replace width+heights.
        contents = re.sub(r'width="24"', 'width="100%"', contents)
        contents = re.sub(r'height="24"', 'height="100%"', contents)
        # Remove feather classes.
        contents = re.sub(r'class="[^"]+"', "", contents)

    # Turn into React component.
    contents = f"""\
/* dprint-ignore-file */
/* eslint-disable */
import {{ FC }} from "react";

const IconComponent: FC = () => (
{indent(contents, 1)}
);

export default IconComponent
"""

    icon_name = f.with_suffix("").name
    # Give them some shitty file name so that we don't accidentally auto-import them. An example is
    # the `Type` icon--it can be accidentally autoimported when attempting to import the Type
    # component.
    fnew = output_dir / f"_x-icon-{icon_name}.tsx"
    print(f"Writing to {fnew}")
    with fnew.open("w") as fp:
        fp.write(contents)
