import { t } from "@foundation/theme/styles";
import { createVar, style } from "@vanilla-extract/css";

export const layoutPadding = createVar();

export const sLayoutPaddingVariables = style({
  height: "100%",
  vars: { [layoutPadding]: t.space[44] },
  "@media": {
    [t.breakpoints.lg]: { vars: { [layoutPadding]: t.space[28] } },
    [t.breakpoints.md]: { vars: { [layoutPadding]: t.space[12] } },
    [t.breakpoints.sm]: { vars: { [layoutPadding]: t.space[8] } },
    [t.breakpoints.xs]: { vars: { [layoutPadding]: t.space[4] } },
  },
});
