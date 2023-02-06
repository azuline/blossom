import { flattenRecord } from "@foundation/lib/flattenRecord";
import { createGlobalTheme, globalFontFace, globalStyle } from "@vanilla-extract/css";
import { createSprinkles, defineProperties } from "@vanilla-extract/sprinkles";
import "./reset.css";

const media = {
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
    bg: {
      app: "hsl(158, 6%, 97%)",
      transparent: "transparent",
      neutral: {
        "1": "hsl(150, 8%, 99%)",
        "2": "hsl(150, 8%, 94%)",
        "3": "hsl(158, 6%, 90%)",
        "4": "hsl(158, 6%, 76%)",
        "5": "hsl(158, 4%, 54%)",
        "6": "hsl(158, 4%, 33%)",
        "7": "hsl(158, 4%, 16%)",
      },
      primary: "hsl(227, 59%, 57%)",
      danger: "hsl(4, 92%, 40%)",
    },
    content: {
      primary: "hsl(227, 59%, 57%)",
      danger: "hsl(4, 92%, 40%)",
      neutral: {
        "1": "hsl(158, 4%, 0%)",
        "2": "hsl(158, 4%, 20%)",
        "3": "hsl(158, 4%, 33%)",
        "4": "hsl(158, 4%, 44%)",
        "5": "hsl(158, 8%, 66%)",
        "6": "hsl(158, 8%, 80%)",
        "7": "hsl(158, 8%, 94%)",
      },
      embellish: "hsla(0, 0%, 0%, 0.06)",
      link: "hsl(227, 70%, 45%)",
    },
    border: {
      transparent: "transparent",
      danger: "hsl(4, 92%, 40%)",
      focus: "hsl(227, 70%, 45%)",
      neutral: {
        "1": "hsl(0, 0%, 38%)",
        "2": "hsl(0, 0%, 52%)",
        "3": "hsl(0, 0%, 64%)",
        "4": "hsl(0, 0%, 87%)",
      },
      gradient: {
        "1":
          "linear-gradient(169.19deg, #C1D7F8 2.73%, #E6E6E6 25.28%, #DCE9FD 53.27%, #DCE9FD 70.27%, #E6E6E6 98.72%)",
      },
    },
    scrollbar: "hsl(0, 0%, 76%)",
    hover: {
      neutral: "hsla(158, 4%, 30%, 15%)",
      primary: "hsla(227, 59%, 20%, 40%)",
      danger: "hsla(4, 92%, 20%, 40%)",
    },
  },
  shadows: {
    light: "0px 4px 4px rgba(220, 220, 220, 0.25), 0px 12px 14px rgba(198, 198, 198, 0.05)",
  },
  size: {
    "0": "0px",
    "1": "2px",
    "2": "4px",
    "3": "6px",
    "4": "8px",
    "5": "12px",
    "6": "16px",
    "7": "20px",
    "8": "32px",
    "9": "44px",
    "10": "64px",
    "11": "96px",
    "12": "128px",
    "13": "160px",
    "14": "216px",
    "15": "272px",
    "16": "356px",
    "17": "480px",
    "18": "704px",
    "19": "960px",
    "20": "1216px",
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
    "1": "2px",
    "2": "4px",
    "3": "6px",
    "4": "8px",
    "5": "12px",
    "6": "16px",
    "7": "20px",
    "8": "32px",
    "9": "44px",
    "10": "64px",
    "11": "96px",
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
  media,
});

const conditions = {
  conditions: {
    // responsive
    all: {},
    xxl: { "@media": media.xxl },
    xl: { "@media": media.xl },
    lg: { "@media": media.lg },
    md: { "@media": media.md },
    sm: { "@media": media.sm },
    xs: { "@media": media.xs },
    // interactive
    hover: { selector: "&:hover" },
    focus: { selector: "&:focus" },
  },
  defaultCondition: "all",
} as const;

export const sxsets = {
  size: defineProperties({
    ...conditions,
    properties: {
      width: t.size,
      height: t.size,
      minHeight: t.size,
      minWidth: t.size,
      maxHeight: t.size,
      maxWidth: t.size,
    },
    shorthands: {
      w: ["width"],
      h: ["height"],
      minh: ["minHeight"],
      minw: ["minWidth"],
      maxh: ["maxHeight"],
      maxw: ["maxWidth"],
    },
  }),
  space: defineProperties({
    ...conditions,
    properties: {
      padding: t.space,
      paddingTop: t.space,
      paddingBottom: t.space,
      paddingLeft: t.space,
      paddingRight: t.space,
    },
    shorthands: {
      p: ["padding"],
      px: ["paddingLeft", "paddingRight"],
      py: ["paddingTop", "paddingBottom"],
      pl: ["paddingLeft"],
      pr: ["paddingRight"],
      pb: ["paddingBottom"],
      pt: ["paddingTop"],
    },
  }),
  overflow: defineProperties({
    ...conditions,
    properties: {
      overflow: ["auto", "scroll", "hidden"],
      overflowX: ["auto", "scroll", "hidden"],
      overflowY: ["auto", "scroll", "hidden"],
    },
  }),
  typography: defineProperties({
    ...conditions,
    properties: {
      text: {
        xs: {
          fontSize: t.font.size.xs,
          fontWeight: t.font.weight.regular,
        },
        sm: {
          fontSize: t.font.size.sm,
          fontWeight: t.font.weight.regular,
        },
        md: {
          fontSize: t.font.size.md,
          fontWeight: t.font.weight.regular,
        },
        lg: {
          fontSize: t.font.size.lg,
          fontWeight: t.font.weight.regular,
        },
        "disp-lg": {
          fontSize: t.font.size.lg,
          fontWeight: t.font.weight.medium,
        },
        "disp-xl": {
          fontSize: t.font.size.xl,
          fontWeight: t.font.weight.medium,
        },
        "disp-xxl": {
          fontSize: t.font.size.xxl,
          fontWeight: t.font.weight.medium,
        },
      },
      fontSize: t.font.size,
      fontWeight: t.font.weight,
      whiteSpace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap"],
      truncate: {
        true: {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
      },
    },
    shorthands: {
      size: ["fontSize"],
      weight: ["fontWeight"],
    },
  }),
  radius: defineProperties({
    ...conditions,
    properties: {
      borderRadius: t.radius,
    },
    shorthands: {
      radius: ["borderRadius"],
    },
  }),
  flex: defineProperties({
    ...conditions,
    properties: {
      gap: t.space,
      flexDirection: ["row", "column", "row-reverse", "column-reverse"],
      flexWrap: ["wrap", "wrap-reverse"],
      justifyContent: {
        initial: "initial",
        start: "flex-start",
        end: "flex-end",
        center: "center",
        "space-between": "space-between",
        "space-evenly": "space-evenly",
      },
      alignItems: {
        initial: "initial",
        stretch: "stretch",
        start: "flex-start",
        end: "flex-end",
        center: "center",
        baseline: "baseline",
      },
    },
    shorthands: {
      dir: ["flexDirection"],
      wrap: ["flexWrap"],
      justify: ["justifyContent"],
      align: ["alignItems"],
    },
  }),
  position: defineProperties({
    ...conditions,
    properties: {
      position: ["relative", "static", "fixed", "absolute", "sticky"],
    },
    shorthands: {
      pos: ["position"],
    },
  }),
  display: defineProperties({
    ...conditions,
    properties: {
      display: [
        "block",
        "inline",
        "inline-block",
        "flex",
        "inline-flex",
        "grid",
        "inline-grid",
        "flow-root",
        "none",
        "contents",
      ],
    },
    shorthands: {
      disp: ["display"],
    },
  }),
  color: defineProperties({
    ...conditions,
    properties: {
      color: flattenRecord(t.color.content),
      background: flattenRecord(t.color.bg),
    },
    shorthands: {
      col: ["color"],
      bg: ["background"],
    },
  }),
  border: defineProperties({
    ...conditions,
    properties: {
      borderStyle: ["solid", "dashed", "dotted", "hidden", "none"],
      borderWidth: t.border,
      borderColor: flattenRecord(t.color.border),
    },
    shorthands: {
      bwidth: ["borderWidth"],
      bcol: ["borderColor"],
      bstyle: ["borderStyle"],
    },
  }),
  cursor: defineProperties({
    ...conditions,
    properties: {
      cursor: ["auto", "pointer", "not-allowed"],
    },
  }),
  shadow: defineProperties({
    ...conditions,
    properties: {
      boxShadow: t.shadows,
    },
    shorthands: {
      shadow: ["boxShadow"],
    },
  }),
  isolation: defineProperties({
    ...conditions,
    properties: {
      isolation: ["isolate"],
    },
  }),
} as const;

const _sx = createSprinkles(
  sxsets.size,
  sxsets.space,
  sxsets.overflow,
  sxsets.typography,
  sxsets.radius,
  sxsets.flex,
  sxsets.position,
  sxsets.display,
  sxsets.color,
  sxsets.border,
  sxsets.cursor,
  sxsets.shadow,
  sxsets.isolation,
);

// From the sprinkles type, omit all the long-form styles.
// We want to only use short form styles for consistency.
export type SX = Omit<
  Parameters<typeof _sx>[0],
  | "width"
  | "height"
  | "minHeight"
  | "minWidth"
  | "maxHeight"
  | "maxWidth"
  | "paddingTop"
  | "paddingBottom"
  | "paddingLeft"
  | "paddingRight"
  | "padding"
  | "fontSize"
  | "fontWeight"
  | "borderRadius"
  | "flexDirection"
  | "flexWrap"
  | "justifyContent"
  | "alignItems"
  | "position"
  | "display"
  | "color"
  | "background"
  | "borderWidth"
  | "borderColor"
  | "borderStyle"
  | "boxShadow"
>;

// Instead of exporting `sx` directly from createSprinkles, we first massage the type
// and then export it here with a type cast. This ensures that long form styles are not
// used.
export const sx = _sx as (arg0: SX) => string;

globalFontFace(t.font.face.body, {
  fontStyle: "normal",
  fontWeight: "100 900",
  fontDisplay: "swap",
  src: "url('/fonts/Inter.var.woff2') format('woff2-variations')",
});
globalFontFace(t.font.face.body, {
  fontStyle: "italic",
  fontWeight: "100 900",
  fontDisplay: "swap",
  src: "url('/fonts/Inter-Italic.var.woff2') format('woff2-variations')",
});

// Default all typography to the standard text.
globalStyle("html", {
  fontFamily: `${t.font.face.body}, sans-serif`,
  fontSize: t.font.size.md,
  fontWeight: t.font.weight.regular,
});
// Enable optical sizing to enable Inter Display.
globalStyle("html", {
  fontOpticalSizing: "auto",
});
// Default all borders to solid style. This way, we do not need to specify `bstyle`
// everywhere.
globalStyle("*", {
  borderStyle: "solid",
  borderWidth: 0,
});
