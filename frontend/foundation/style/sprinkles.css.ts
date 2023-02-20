import { flattenRecord } from "@foundation/lib/flattenRecord";
import { breakpoints, t } from "@foundation/style/theme.css";
import { createSprinkles, defineProperties } from "@vanilla-extract/sprinkles";

const conditions = {
  conditions: {
    // responsive
    initial: {},
    xxl: { "@media": breakpoints.xxl },
    xl: { "@media": breakpoints.xl },
    lg: { "@media": breakpoints.lg },
    md: { "@media": breakpoints.md },
    sm: { "@media": breakpoints.sm },
    xs: { "@media": breakpoints.xs },
    // interactive
    hover: { selector: "&:hover" },
    focus: { selector: "&:focus" },
  },
  defaultCondition: "initial",
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
      paragraph: {
        true: {
          lineHeight: t.font.lineHeight.paragraph,
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
      background: flattenRecord(t.color.background),
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
