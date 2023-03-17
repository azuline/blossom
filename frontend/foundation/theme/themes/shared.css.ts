import { createGlobalTheme } from "@vanilla-extract/css";

export const breakpoints = {
  // The screen sizes are:
  //   xs   = 440px
  //   sm   = 576px
  //   md   = 768px
  //   lg   = 992px
  //   xl   = 1200px
  //   xxl  = 1440px
  //
  // We are mobile-first; each breakpoint sits between the screen sizes.
  xs: "(min-width: 508px)",
  sm: "(min-width: 672px)",
  md: "(min-width: 880px)",
  lg: "(min-width: 1092px)",
  xl: "(min-width: 1320px)",
} as const;

const spaceScale = {
  "0": "0px",
  "2": "2px",
  "4": "4px",
  "6": "6px",
  "8": "8px",
  "10": "10px",
  "12": "12px",
  "16": "16px",
  "20": "20px",
  "24": "24px",
  "28": "28px",
  "36": "36px",
  "44": "44px",
  "56": "56px",
  "64": "64px",
  "80": "80px",
  "96": "96px",
  "128": "128px",
  "160": "160px",
} as const;

export const themeSharedVars = createGlobalTheme(":root", {
  size: {
    ...spaceScale,
    "216": "216px",
    "272": "272px",
    "356": "356px",
    "452": "452px",
    "576": "576px",
    "704": "704px",
    "920": "920px",
    "1188": "1188px",
    "1440": "1440px",
    "1/5": "20%",
    "1/4": "25%",
    "2/5": "40%",
    "1/2": "50%",
    "3/5": "60%",
    "3/4": "75%",
    "4/5": "80%",
    full: "100%",
  },
  space: {
    ...spaceScale,
    full: "100%",
  },
  radius: {
    "0": "0px",
    "2": "2px",
    "4": "4px",
    "6": "6px",
    "8": "8px",
    "12": "12px",
    "16": "16px",
    "32": "32px",
    circle: "9999px",
  },
  border: {
    "0": "0px",
    "1": "1px",
    "2": "2px",
    "4": "4px",
  },
  zindex: {
    "10": "10",
    "20": "20",
    "30": "30",
    "40": "40",
    "50": "50",
  },
  transition: {
    easeOut: {
      fast: "all 0.2s easeOut",
    },
  },
  flex: {
    grow: "1 0 auto",
    shrink: "0 1 0px",
    static: "0 0 auto",
  },
  media: breakpoints,
});
