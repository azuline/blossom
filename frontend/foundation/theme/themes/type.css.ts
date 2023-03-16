import { createGlobalTheme } from "@vanilla-extract/css";

export const fontFaces = {
  display: "Inter",
  body: "Alegreya Sans",
  code: "Source Code Pro",
} as const;

export const themeTypeVars = createGlobalTheme(":root", {
  font: {
    face: fontFaces,
    weight: {
      logo: "300",
      display: {
        default: "200",
        strong: "500",
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
      xs: "14px",
      sm: "16px",
      md: "20px",
      lg: "26px",
      xl: "32px",
      xxl: "44px",
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
    letterSpacing: {
      display: "-0.03em",
    },
  },
});
