#!/usr/bin/env python

import json
import logging
import re
import subprocess
import sys
from pathlib import Path
from typing import Any

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


def lower_first(s: str) -> str:
    return s[0].lower() + s[1:]


class UnknownJSONValueError(Exception):
    pass


def convert_token_to_ts(
    value: str,
    *,
    palette: Palette | None = None,
    palette_name: str | None = None,
    remove_accessor_prefix: str | None = None,
) -> str:
    """
    Take in a Figma token value and turn it into a string that contains valid TypeScript code.

    Either palette or palette_name must be passed. If palette is passed, then any references will be
    directly converted to Hex. If palette_name is accessed, then any references will be converted to
    a TypeScript reference to that value.

    Final value sample: '"#00000066"'
    Reference sample: "{Palette.Neutral.6}66"

    Final value sample: '"0 0 1px 1px"+moonlightPalette["neutral"]["6"]+"66"'
    Reference sample: "0 0 1px 1px {Palette.Neutral.6}66"
    """
    assert (
        palette is not None or palette_name is not None
    ), "One of palette or palette_name must be passed."
    assert not (
        palette is not None and palette_name is not None
    ), "Only one of palette or palette_name must be passed. Do not pass both."
    logger.debug(f"Converting token {value=}.")

    value = f'"{value}"'
    # Look for references and convert them. If none are found, continue.
    while True:
        ref_start = value.find("{")
        if ref_start == -1:
            break

        ref_end = value.find("}", ref_start) + 1
        assert ref_end != 0, f"Did not find end of reference in {value}."

        ref = value[ref_start:ref_end]
        if remove_accessor_prefix and ref.startswith("{" + remove_accessor_prefix):
            ref = "{" + ref[len(remove_accessor_prefix) + 1 :]
        m = REFERENCE_REGEX.match(ref)
        assert m is not None, f"Figma Tokens reference {value} did not match regex."
        keys = m[1].split(".")

        if palette:
            # Chain access all keys and get the value of the final Figma Tokens object.
            evaluated = palette
            for k in keys:
                assert k in evaluated, f"Didn't find {k=} in {evaluated=}"
                evaluated = evaluated[k]
            evaluated = evaluated["value"]
            assert isinstance(
                evaluated, str
            ), f"Accessed reference of {value} but arrived at non-string {evaluated}."

            value = value[:ref_start] + evaluated + value[ref_end:]
        elif palette_name:
            # Assemble the accessor to the palette name.
            out = palette_name
            for k in keys:
                out += f'["{lower_first(k)}"]'

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

    def convert_item(item: dict[str, Any]) -> dict[str, Any] | str:
        """Recursive dictionary converter."""
        if item.get("type", False) == "color":
            return convert_token_to_ts(
                item["value"],
                palette=inp,
                remove_accessor_prefix="Palette.",
            )

        out = {}
        for k, v in item.items():
            logger.debug(f"Converting recursive item {k=}.")
            out[lower_first(k)] = convert_item(v)
        return out

    return convert_item(inp)  # type: ignore


def convert_color_theme(palette_name: str, inp: FigmaTokensInput) -> Theme:
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

    def convert_item(item: dict[str, Any]) -> dict[str, Any] | str:
        """Recursive dictionary converter."""
        if item.get("type", False) == "color":
            return convert_token_to_ts(
                item["value"],
                palette_name=palette_name,
                remove_accessor_prefix="Palette.",
            )

        out = {}
        for k, v in item.items():
            logger.debug(f"Converting recursive item {k=}.")
            out[lower_first(k)] = convert_item(v)
        return out

    return convert_item(inp)  # type: ignore


# -------------------
# Shadow converter functions.
# -------------------


def convert_shadow_primitives(inp: FigmaTokensInput, color_palette: FigmaTokensInput) -> Palette:
    """
    Input sample:

      {
        "Cutout": {
          "type": "boxShadow",
          "value": { "x": "0", "y": "0", ... },
        },
        "SourceShadow": {
          "Low": {
            "type": "boxShadow",
            "value": { "x": "0", "y": "0", ... },
          },
        }
      }

    Output sample:

      {
        "cutout": "0 0 ...",
        "sourceShadow": {
          "low": "0 0 ..."
        }
      }
    """

    def convert_item(item: dict[str, Any]) -> dict[str, Any] | str:
        """Recursive dictionary converter."""
        if item.get("type", False) == "boxShadow":
            value = ""

            raw = item["value"]
            if raw["type"] == "innerShadow":
                value += "inset "
            value += f'{raw["x"]}px {raw["y"]}px {raw["blur"]}px {raw["spread"]}px {raw["color"]}'

            return convert_token_to_ts(
                value,
                palette=color_palette,
                remove_accessor_prefix="Palette.",
            )

        out = {}
        for k, v in item.items():
            logger.debug(f"Converting recursive item {k=}.")
            out[lower_first(k)] = convert_item(v)
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
moonlight_light = convert_color_theme("moonlightPalette", tokens_raw["Moonlight Light"]["Theme"])
logger.info("Converting moonlight dark theme.")
moonlight_dark = convert_color_theme("moonlightPalette", tokens_raw["Moonlight Dark"]["Theme"])

shadow_primitives_light = convert_shadow_primitives(
    tokens_raw["Moonlight Light"]["Shadow Primitives"],
    color_palette=tokens_raw["Moonlight Palette"]["Palette"],
)
# moonlight_shadows_light = convert_shadows()

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
    fp.write(dict_to_ts("shadowPrimitivesLight", shadow_primitives_light))

DPRINT_CONFIG = Path(__file__).parent.parent.parent.parent / "dprint.json"
subprocess.run(["dprint", "fmt", "--config", str(DPRINT_CONFIG)])
