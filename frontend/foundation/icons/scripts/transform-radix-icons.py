#!/usr/bin/env python

"""
This script was run on the directory of Radix Icons to transform them into
the format we want.

Changes:
1. Change width/height from 15 to 100%, so that we can control it with a
   parent component.
2. Update these from svgs to React components.

This script takes in a directory name as an argument.
"""

from pathlib import Path

icons_dir = Path(__file__).parent.parent / "svgs" / "radix"


def indent(s: str, i: int) -> str:
    return "\n".join(["  " * i + sl for sl in s.splitlines()])


for f in icons_dir.glob("*.svg"):
    with f.open("r") as fp:
        contents = fp.read()

    # Replace width+heights.
    contents = contents.replace('width="15"', 'width="100%"')
    contents = contents.replace('height="15"', 'height="100%"')

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

    fnew = f.with_suffix(".tsx")
    with fnew.open("w") as fp:
        fp.write(contents)

    f.unlink()
