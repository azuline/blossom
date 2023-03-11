import { createGlobalTheme } from "@vanilla-extract/css";

export const breakpoints = {
  // The screen sizes are:
  //   xs   = 440px
  //   sm   = 576px
  //   md   = 768px
  //   lg   = 992px
  //   xl   = 1200px
  //   xxl  = 1440px
  //   xxxl = 1920px.
  //
  // We are desktop first; each breakpoint sits between the screen sizes.
  xxl: "(max-width: 1680px)",
  xl: "(max-width: 1320px)",
  lg: "(max-width: 1092px)",
  md: "(max-width: 880px)",
  sm: "(max-width: 672px)",
  xs: "(max-width: 508px)",
} as const;

export const themeSharedVars = createGlobalTheme(":root", {
  size: {
    "0": "0px",
    "2": "2px",
    "4": "4px",
    "6": "6px",
    "8": "8px",
    "10": "10px",
    "12": "12px",
    "16": "16px",
    "20": "20px",
    "28": "28px",
    "36": "36px",
    "44": "44px",
    "64": "64px",
    "80": "80px",
    "96": "96px",
    "128": "128px",
    "160": "160px",
    "216": "216px",
    "272": "272px",
    "356": "356px",
    "480": "480px",
    "576": "576px",
    "704": "704px",
    "960": "960px",
    "1216": "1216px",
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
    "0": "0px",
    "2": "2px",
    "4": "4px",
    "6": "6px",
    "8": "8px",
    "10": "10px",
    "12": "12px",
    "16": "16px",
    "20": "20px",
    "28": "28px",
    "36": "36px",
    "44": "44px",
    "64": "64px",
    "80": "80px",
    "96": "96px",
    "128": "128px",
    "160": "160px",
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
  media: breakpoints,
});
