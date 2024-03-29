import { createGlobalTheme } from "@vanilla-extract/css";

export const fontFaces = {
  display: "EB Garamond",
  body: "Alegreya Sans",
  code: "Source Code Pro",
} as const;

export const themeTypeVars = createGlobalTheme(":root", {
  font: {
    face: fontFaces,
    weight: {
      logo: "300",
      display: {
        default: "400",
        strong: "600",
      },
      body: {
        default: "400",
        strong: "600",
      },
      code: {
        default: "400",
        strong: "600",
      },
    },
    size: {
      body: {
        xs: "14px",
        sm: "16px",
        md: "20px",
        lg: "26px",
      },
      display: {
        sm: "16px",
        md: "20px",
        lg: "26px",
        xl: "32px",
        xxl: "40px",
        xxxl: "52px",
      },
      code: {
        xs: "12px",
        sm: "14px",
        md: "18px",
        lg: "24px",
      },
    },
    lineHeight: {
      label: "1",
      paragraph: {
        xs: "20px",
        sm: "24px",
        md: "30px",
        lg: "34px",
        xl: "44px",
        xxl: "52px",
        xxxl: "72px",
      },
    },
  },
});
