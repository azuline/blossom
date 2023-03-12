import {
  moonlightDark,
  moonlightLight,
  moonlightPalette,
} from "@foundation/theme/codegen/moonlight.css";
import { createTheme } from "@vanilla-extract/css";

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
  // dprint-ignore
  shadows: {
    // "Cut" the content out of the background with a small ring.
    outerCut: {
      weak: `0 0 0 0.5px ${moonlightPalette.neutral[6]}0D`,
      strong: `0 0 0 0.5px ${moonlightPalette.neutral[6]}26`,
    },
    // Inner light on the element to "pop" it up.
    innerLight: `inset 0 0 1px 1px ${moonlightPalette.neutral[98]}0D, inset 1px 1px 2px 0 ${moonlightPalette.neutral[98]}26`,
    // Inner shadow on the element to "push" it in.
    innerShadow: {
      weak: `inset 0 0 1px 1px ${moonlightPalette.neutral[6]}05, inset 1px 1px 2px 0 ${moonlightPalette.neutral[6]}14`,
      strong: `inset 0 0 1px 1px ${moonlightPalette.neutral[6]}0D, inset 1px 1px 2px 0 ${moonlightPalette.neutral[6]}33`,
    },
    // Outer shadow on the element to create depth.
    outerShadow: {
      sm: `0.5px 0.5px 1.5px 0 ${moonlightPalette.neutral[6]}33, 1.5px 1.5px 5px 0 ${moonlightPalette.neutral[6]}0D`,
      md: `1px 1px 2px 0 ${moonlightPalette.neutral[6]}33, 2px 2px 8px 0 ${moonlightPalette.neutral[6]}1A`,
    },
  },
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
  // TODO: Copied from light mode; tweak for dark mode later.
  // dprint-ignore
  shadows: {
    // "Cut" the content out of the background with a small ring.
    outerCut: {
      weak: `0 0 0 0.5px ${moonlightPalette.neutral[6]}0D`,
      strong: `0 0 0 0.5px ${moonlightPalette.neutral[6]}26`,
    },
    // Inner light on the element to "pop" it up.
    innerLight: `inset 0 0 1px 1px ${moonlightPalette.neutral[98]}0D, inset 1px 1px 2px 0 ${moonlightPalette.neutral[98]}26`,
    // Inner shadow on the element to "push" it in.
    innerShadow: {
      weak: `inset 0 0 1px 1px ${moonlightPalette.neutral[6]}05, inset 1px 1px 2px 0 ${moonlightPalette.neutral[6]}14`,
      strong: `inset 0 0 1px 1px ${moonlightPalette.neutral[6]}0D, inset 1px 1px 2px 0 ${moonlightPalette.neutral[6]}33`,
    },
    // Outer shadow on the element to create depth.
    outerShadow: {
      sm: `0.5px 0.5px 1.5px 0 ${moonlightPalette.neutral[6]}33, 1.5px 1.5px 5px 0 ${moonlightPalette.neutral[6]}0D`,
      md: `1px 1px 2px 0 ${moonlightPalette.neutral[6]}33, 2px 2px 8px 0 ${moonlightPalette.neutral[6]}1A`,
    },
  },
});
