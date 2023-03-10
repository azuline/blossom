#!/usr/bin/env python

"""
This script transforms the svgs in `svgs/` into React components in `codegen/components`.

Changes:
1. Change width/height of SVGs to 100%, so that we can control width and height with a parent
   component.
2. Update svgs to React components.
"""

import re
from pathlib import Path
import shutil

icons_dir = Path(__file__).parent.parent / "svgs"
output_dir = Path(__file__).parent.parent / "codegen" / "icons"
shutil.rmtree(output_dir)
output_dir.mkdir(exist_ok=True, parents=True)


def indent(s: str, i: int) -> str:
    return "\n".join(["  " * i + sl for sl in s.splitlines()])


for f in icons_dir.glob("**/*.svg"):
    print(f"Handling icon: {f}")
    with f.open("r") as fp:
        contents = fp.read()

    # Replace width+heights.
    contents = re.sub(r'width="[^"]+"', 'width="100%"', contents)
    contents = re.sub(r'height="[^"]+"', 'height="100%"', contents)
    # Remove any classes.
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

    fnew = output_dir / f.with_suffix(".tsx").name
    print(f"Writing to {fnew}")
    with fnew.open("w") as fp:
        fp.write(contents)
