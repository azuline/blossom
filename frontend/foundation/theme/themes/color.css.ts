import {
  moonlightDark,
  moonlightLight,
  moonlightPalette,
} from "@foundation/theme/codegen/moonlight.css";
import { createTheme } from "@vanilla-extract/css";

const shadows = {
  // Inner shadow on the element to "push" it in.
  inset: {
    sm:
      // Top ridge shadow.
      `inset 0.5px 0.5px 1px 0 ${moonlightPalette.neutral[6]}14`
      // Bottom ridge light reflection.
      + `, inset -1px -1px 1px 0 ${moonlightPalette.neutral[98]}14`
      // Add a 1px border with opacity.
      + `, 0 0 0 1px ${moonlightPalette.neutral[85]}80`,
    md:
      // Top ridge shadow.
      `inset 1px 1px 1px 2px ${moonlightPalette.neutral[6]}14`
      // Bottom ridge light reflection.
      + `, inset -1px -1px 2px 2px ${moonlightPalette.neutral[98]}14`
      // Add a 1px border with opacity.
      + `, 0 0 0 1px ${moonlightPalette.neutral[85]}80`,
  },
  // Elevate an element. Inspired by
  // https://twitter.com/PixelJanitor/status/1623358575904194562.
  elevate: {
    sm:
      // Cut element out of the background.
      `0 0 0 0.5px ${moonlightPalette.neutral[6]}0D`
      // Add a 1px border with opacity.
      + `, 0 0 0 1px ${moonlightPalette.neutral[85]}80`
      // Light source outer shadow.
      + `, 0.5px 0.5px 1.5px 0 ${moonlightPalette.neutral[6]}33`
      // Ambient outer shadow.
      + `, 1.5px 3px 6px 0 ${moonlightPalette.neutral[6]}0D`
      // Light source inner light.
      + `, inset 0.5px 0.5px 1px 1px ${moonlightPalette.neutral[98]}26`
      // Ambient reflective inner light.
      + `, inset 0 0 1px 1px ${moonlightPalette.neutral[98]}0D`,
    md:
      // Cut element out of the background.
      `0 0 0 0.5px ${moonlightPalette.neutral[6]}0D`
      // Add a 1px border with opacity.
      + `, 0 0 0 1px ${moonlightPalette.neutral[85]}80`
      // Light source shadow.
      + `, 1px 1px 2px 0 ${moonlightPalette.neutral[6]}33`
      // Ambient shadow.
      + `, 2px 4px 8px 0 ${moonlightPalette.neutral[6]}1A`
      // Light source inner light.
      + `, inset 1px 1px 2px 0 ${moonlightPalette.neutral[98]}26`
      // Ambient reflective inner light.
      + `, inset 0 0 1px 1px ${moonlightPalette.neutral[98]}0D`,
  },
};

export const [themeMoonlightLightClass, themeMoonlightLightVars] = createTheme({
  color: moonlightLight,
  outline: {
    focus: {
      value: `2px solid ${moonlightPalette.brand["74"]}`,
      offset: "2px",
    },
    error: {
      value: `2px solid ${moonlightLight.border.negative.default}`,
      offset: "2px",
    },
  },
  shadows,
});

export const themeMoonlightDarkClass = createTheme(themeMoonlightLightVars, {
  color: moonlightDark,
  outline: {
    focus: {
      value: `2px solid ${moonlightPalette.brand["74"]}`,
      offset: "2px",
    },
    error: {
      value: `2px solid ${moonlightDark.border.negative.default}`,
      offset: "2px",
    },
  },
  // TODO: Copied from light mode; re-do for dark mode later.
  shadows,
});
