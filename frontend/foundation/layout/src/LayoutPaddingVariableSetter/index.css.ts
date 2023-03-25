import { t } from "@foundation/theme";
import { createVar, style } from "@vanilla-extract/css";

export const layoutPadding = createVar();

export const sLayoutPaddingVariables = style({
  height: "100%",
  vars: { [layoutPadding]: t.space[12] },
  "@media": {
    [t.breakpoints.sm]: { vars: { [layoutPadding]: t.space[20] } },
    [t.breakpoints.md]: { vars: { [layoutPadding]: t.space[28] } },
    [t.breakpoints.lg]: { vars: { [layoutPadding]: t.space[36] } },
    [t.breakpoints.xl]: { vars: { [layoutPadding]: t.space[44] } },
  },
});
