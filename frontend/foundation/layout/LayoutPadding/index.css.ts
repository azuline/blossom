import { breakpoints, t } from "@foundation/style/theme.css";
import { createVar, style } from "@vanilla-extract/css";

export const layoutPadding = createVar();

export const sLayoutPaddingVariables = style({
  height: "100%",
  vars: { [layoutPadding]: t.space[44] },
  "@media": {
    [breakpoints.lg]: {
      vars: { [layoutPadding]: t.space[28] },
    },
    [breakpoints.sm]: {
      vars: { [layoutPadding]: t.space[12] },
    },
  },
});

export const sLayoutPaddingUse = style({
  height: "100%",
  padding: layoutPadding,
});
