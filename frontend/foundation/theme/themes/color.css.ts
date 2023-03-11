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
  shadows: {
    weak: "0px 4px 4px rgba(220, 220, 220, 0.25), 0px 12px 14px rgba(198, 198, 198, 0.05)",
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
  shadows: {
    weak: "0px 4px 4px rgba(220, 220, 220, 0.04), 0px 12px 14px rgba(198, 198, 198, 0.02)",
  },
});
