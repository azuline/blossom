import { breakpoints, t } from "@foundation/style/theme.css";
import { createVar, style } from "@vanilla-extract/css";

export const applicationLayoutPadding = createVar();

export const sApplicationLayout = style({
  height: "100%",
  padding: applicationLayoutPadding,
  vars: { [applicationLayoutPadding]: t.space[44] },
  "@media": {
    [breakpoints.lg]: {
      vars: { [applicationLayoutPadding]: t.space[28] },
    },
    [breakpoints.sm]: {
      vars: { [applicationLayoutPadding]: t.space[12] },
    },
  },
});
