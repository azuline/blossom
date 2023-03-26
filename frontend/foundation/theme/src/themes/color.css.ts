import { createTheme } from "@vanilla-extract/css";
import {
  elevationLight,
  moonlightDark,
  moonlightLight,
} from "../codegen/moonlight.css";

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
  shadows: elevationLight,
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
  shadows: elevationLight,
});
