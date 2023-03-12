#!/usr/bin/env python

import logging
import json
import subprocess
import re
from pathlib import Path
from typing import Any
import sys

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
stream_formatter = logging.Formatter(
    "%(asctime)s.%(msecs)03d - %(name)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
stream_handler = logging.StreamHandler(sys.stdout)
stream_handler.setFormatter(stream_formatter)
logger.addHandler(stream_handler)


FigmaTokensInput = dict[str, Any]
Palette = dict[str, Any]
Theme = dict[str, Any]

REFERENCE_REGEX = re.compile(r"\{([^}]+)\}")


class UnknownJSONValueError(Exception):
    pass


# -------------------
# Color converter functions.
# -------------------


def convert_palette(inp: FigmaTokensInput) -> Palette:
    """
    Input sample:

      {
        "Neutral": {
          "6": {
            "value": "#08051B",
            "type": "color"
          }
        }
        "Overlay": {
          "28": {
            "value": "{Palette.Neutral.6}66",
            "type": "color"
          }
        }
      }

    Output sample:

      {
        "neutral": {
          "6": "\"#08051B\""
        },
        "overlay": {
          "28": "\"#08051B66\"",
        }
      }
    """

    def convert_value(value: str) -> str:
        """
        Input can either be a final value or a reference. If value is a reference, we look it up
        from the Figma Tokens input.

        Final value sample:

          "#000000"

        Reference sample:

          "{Palette.Neutral.6}66"
        """
        logger.debug(f"Converting {value=}.")

        value = f'"{value}"'
        # Look for references and convert them. If none are found, continue.
        while True:
            ref_start = value.find("{")
            if ref_start == -1:
                break

            ref_end = value.find("}", ref_start) + 1
            assert ref_end != 0, f"Did not find end of reference in {value}."

            m = REFERENCE_REGEX.match(value[ref_start:ref_end])
            assert m is not None, f"Figma Tokens reference {value} did not match regex."
            keys = m[1].split(".")

            # Remove the top-level Palette key.
            if keys[0] == "Palette":
                keys = keys[1:]

            # Chain access all keys and get the value of the final Figma Tokens object.
            evaluated = inp
            for k in keys:
                assert k in evaluated, f"Didn't find {k=} in {evaluated=}"
                evaluated = evaluated[k]
            evaluated = evaluated["value"]
            assert isinstance(
                evaluated, str
            ), f"Accessed reference of {value} but arrived at non-string {evaluated}."

            value = value[:ref_start] + evaluated + value[ref_end:]

        return value

    def convert_item(item: dict[str, Any]) -> dict[str, Any] | str:
        """Recursive dictionary converter."""
        if item.get("type", False) == "color":
            return convert_value(item["value"])

        out = {}
        for k, v in item.items():
            logger.debug(f"Converting recursive item {k=}.")
            out[k.lower()] = convert_item(v)
        return out

    return convert_item(inp)  # type: ignore


def convert_color_theme(
    palette: Palette, paletteName: str, inp: FigmaTokensInput
) -> Theme:
    """
    Input sample:

      {
        "Background": {
          "Neutral": {
            "Base": {
              "value": "{Palette.Neutral.95}",
              "type": "color"
            }
          }
        }
      }

    Output sample:

      {
        "background": {
          "neutral": {
            "base": moonlightPalette["neutral"]["95"],
          }
        }
      }
    """

    def convert_value(value: str) -> str:
        """
        Input can either be a final value or a reference. If value is a reference, we look it up
        from the Figma Tokens input.

        Final value sample:

          "#000000"

        Reference sample:

          "{Palette.Neutral.6}66"
        """
        logger.debug(f"Converting {value=}.")

        # Quote the string first; all references will be replaced with `"+value+"`.
        value = f'"{value}"'
        # Look for references and convert them. If none are found, continue.
        while True:
            ref_start = value.find("{")
            if ref_start == -1:
                break

            ref_end = value.find("}", ref_start) + 1
            assert ref_end != 0, f"Did not find end of reference in {value}."

            m = REFERENCE_REGEX.match(value[ref_start:ref_end])
            assert m is not None, f"Figma Tokens reference {value} did not match regex."
            keys = m[1].split(".")

            # Remove the top-level Palette key.
            if keys[0] == "Palette":
                keys = keys[1:]

            # Assemble the accessor to the palette name.
            out = paletteName
            for k in keys:
                out += f'["{k.lower()}"]'

            # And do some massaging for a prettier output here by not including leading/trailing
            # empty strings.
            new_value = ""
            if value[:ref_start] != '"':
                new_value += value[:ref_start] + '"+'
            new_value += out
            if value[ref_end:] != '"':
                new_value += '+"' + value[ref_end:]
            value = new_value

        return value

    def convert_item(item: dict[str, Any]) -> dict[str, Any] | str:
        """Recursive dictionary converter."""
        if item.get("type", False) == "color":
            return convert_value(item["value"])

        out = {}
        for k, v in item.items():
            logger.debug(f"Converting recursive item {k=}.")
            out[k.lower()] = convert_item(v)
        return out

    return convert_item(inp)  # type: ignore


# -------------------
# Read in tokens.json and call the transformation functions.
# -------------------

PACKAGE_DIR = Path(__file__).parent.parent.resolve()

with (PACKAGE_DIR / "figma" / "tokens.json").open("r") as fp:
    tokens_raw = json.load(fp)

logger.info("Converting moonlight palette.")
moonlight_palette = convert_palette(tokens_raw["Moonlight Palette"]["Palette"])
logger.info("Converting moonlight light theme.")
moonlight_light = convert_color_theme(
    moonlight_palette,
    "moonlightPalette",
    tokens_raw["Moonlight Light"]["Theme"],
)
logger.info("Converting moonlight dark theme.")
moonlight_dark = convert_color_theme(
    moonlight_palette,
    "moonlightPalette",
    tokens_raw["Moonlight Dark"]["Theme"],
)


# -------------------
# Compile the dicts into TypeScript, write to disk, and format.
# -------------------


def dict_to_ts(variable_name: str, inp: dict[str, Any]) -> str:
    def compile_item(item: dict[str, Any]) -> str:
        out = "{"
        for k, v in item.items():
            if isinstance(v, str):
                out += f'"{k}": {v},'
            elif isinstance(v, dict):
                out += f'"{k}": {compile_item(v)},'
            else:
                raise UnknownJSONValueError(
                    f"Don't know how to transpile {v=} {type(v)=} to TypeScript."
                )
        out += "}"
        return out

    ts = f"\n\nexport const {variable_name} ="
    ts += compile_item(inp)
    ts += "as const;"
    return ts


out_dir = PACKAGE_DIR / "codegen"
out_dir.mkdir(exist_ok=True)
for f in out_dir.iterdir():
    f.unlink()

with (out_dir / "moonlight.css.ts").open("w") as fp:
    fp.write("/* eslint-disable */")
    fp.write(dict_to_ts("moonlightPalette", moonlight_palette))
    fp.write(dict_to_ts("moonlightLight", moonlight_light))
    fp.write(dict_to_ts("moonlightDark", moonlight_dark))

DPRINT_CONFIG = Path(__file__).parent.parent.parent.parent / "dprint.json"
subprocess.run(["dprint", "fmt", "--config", str(DPRINT_CONFIG)])
