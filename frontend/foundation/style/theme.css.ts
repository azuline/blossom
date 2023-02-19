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

const palette = {
  Neutral: {
    "6": "#08051B",
    "14": "#1F1D2D",
    "21": "#2E2C3D",
    "28": "#413E52",
    "38": "#5B586B",
    "48": "#757285",
    "62": "#9896A8",
    "77": "#BEBCCC",
    "85": "#D3D1E0",
    "92": "#E7E6F0",
    "95": "#F1F1F6",
    "100": "#FDFDFF",
  },
  Overlay: {
    "38": "#5B586B33",
    "48": "#75728526",
    "62": "#9896A81a",
  },
  Brand: {
    "40": "#3F319A",
    "48": "#4E3DBA",
    "54": "#5B4BC7",
    "59": "#6B5BD2",
    "64": "#7D6EDA",
    "74": "#A298E3",
    "82": "#BDB6ED",
    "90": "#D8D4F5",
    "94": "#EAE8F9",
  },
  Red: {
    "26": "#870B00",
    "32": "#A21103",
    "43": "#B93424",
    "65": "#DE776B",
    "74": "#E59F93",
    "84": "#F1C6BA",
    "92": "#F6E4E0",
  },
} as const;

export const t = createGlobalTheme("html", {
  font: {
    face: {
      body: "Inter",
    },
    weight: {
      regular: "400",
      medium: "500",
    },
    size: {
      xs: "12px",
      sm: "14px",
      md: "16px",
      lg: "22px",
      xl: "32px",
      xxl: "40px",
    },
  },
  color: {
    background: {
      neutral: {
        strong: palette.Neutral[100],
        default: palette.Neutral[95],
        weak: palette.Neutral[92],
      },
      inverse: {
        strong: palette.Neutral[21],
        default: palette.Neutral[14],
        weak: palette.Neutral[6],
      },
      overlay: {
        hover: palette.Overlay[62],
        active: palette.Overlay[38],
      },
      brand: {
        default: palette.Brand[54],
        hover: palette.Brand[48],
        active: palette.Brand[40],
        disabled: palette.Brand[90],
      },
      negative: {
        default: palette.Red[43],
        hover: palette.Red[32],
        active: palette.Red[26],
        disabled: palette.Red[84],
      },
    },
    content: {
      neutral: {
        strong: palette.Neutral[6],
        default: palette.Neutral[28],
        weak: palette.Neutral[48],
        loader: palette.Neutral[85],
      },
      inverse: {
        strong: palette.Neutral[100],
        default: palette.Neutral[92],
        weak: palette.Neutral[77],
        loader: palette.Neutral[38],
      },
      brand: {
        tint: palette.Brand[94],
        disabled: palette.Brand[64],
        default: palette.Brand[54],
      },
      negative: {
        tint: palette.Red[92],
        disabled: palette.Red[65],
        default: palette.Red[43],
      },
    },
    border: {
      neutral: {
        strong: palette.Neutral[62],
        default: palette.Neutral[77],
        weak: palette.Neutral[85],
      },
      inverse: {
        strong: palette.Neutral[62],
        default: palette.Neutral[38],
        weak: palette.Neutral[21],
      },
      negative: {
        default: palette.Red[65],
      },
    },
    focus: {
      // TODO: Add focus ring style.
      outline: "1px blue",
    },
  },
  shadows: {
    weak: "0px 4px 4px rgba(220, 220, 220, 0.25), 0px 12px 14px rgba(198, 198, 198, 0.05)",
  },
  size: {
    "0": "0px",
    "2": "2px",
    "4": "4px",
    "6": "6px",
    "8": "8px",
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
    "704": "704px",
    "960": "960px",
    "1216": "1216px",
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
  media: breakpoints,
});
