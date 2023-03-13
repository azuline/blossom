import { createGlobalTheme } from "@vanilla-extract/css";

export const fontFaces = {
  display: "Cormorant Garamond",
  body: "Alegreya Sans",
  code: "Source Code Pro",
} as const;

export const themeTypeVars = createGlobalTheme(":root", {
  font: {
    face: fontFaces,
    weight: {
      logo: "300",
      display: {
        default: "500",
        strong: "700",
      },
      body: {
        default: "400",
        strong: "600",
      },
      code: {
        default: "400",
      },
    },
    size: {
      xs: "14px",
      sm: "16px",
      md: "20px",
      lg: "26px",
      xl: "36px",
      xxl: "48px",
    },
    lineHeight: {
      label: "1",
      paragraph: {
        xs: "20px",
        sm: "24px",
        md: "30px",
        lg: "34px",
      },
    },
  },
});
