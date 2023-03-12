import {
  moonlightDark,
  moonlightLight,
  moonlightPalette,
} from "@foundation/theme/codegen/moonlight.css";
import { createTheme } from "@vanilla-extract/css";

const shadows = {
  inset: {
    sm:
      // Top ridge shadow.
      `inset 0.5px 0.5px 1px 0 ${moonlightPalette.neutral[6]}14`
      // Bottom ridge light reflection.
      + `, inset -1px -1px 1px 0 ${moonlightPalette.neutral[98]}14`,
    md:
      // Top ridge shadow.
      `inset 1px 1px 1px 2px ${moonlightPalette.neutral[6]}14`
      // Bottom ridge light reflection.
      + `, inset -1px -1px 2px 2px ${moonlightPalette.neutral[98]}14`,
  },
  // Inspired by https://twitter.com/PixelJanitor/status/1623358575904194562.
  elevate: {
    sm:
      // Cut element out of the background.
      `0 0 0 0.5px ${moonlightPalette.neutral[6]}0D`
      // Light source outer shadow.
      + `, 0.5px 0.5px 2px 0 ${moonlightPalette.neutral[28]}1A`
      // Ambient outer shadow.
      + `, 1.5px 3px 6px 0 ${moonlightPalette.neutral[6]}0D`
      // Light source inner light.
      + `, inset 0.5px 0.5px 1px 0.5px ${moonlightPalette.neutral[98]}26`
      // Ambient reflective inner light.
      + `, inset 0 0 1px 1px ${moonlightPalette.neutral[98]}0D`,
    md:
      // Cut element out of the background.
      `0 0 0 0.5px ${moonlightPalette.neutral[6]}0D`
      // Light source shadow.
      + `, 1px 2px 2px 0 ${moonlightPalette.neutral[28]}26`
      // Ambient shadow.
      + `, 2px 4px 8px 0 ${moonlightPalette.neutral[6]}0D`
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
      value: `2px solid ${moonlightLight.border.brand.default}`,
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
      value: `2px solid ${moonlightDark.border.brand.default}`,
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
