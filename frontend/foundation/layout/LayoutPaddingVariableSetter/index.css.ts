import { t } from "@foundation/theme/styles/theme";
import { breakpoints } from "@foundation/theme/styles/theme.css";
import { createVar, style } from "@vanilla-extract/css";

export const layoutPadding = createVar();

export const sLayoutPaddingVariables = style({
  height: "100%",
  vars: { [layoutPadding]: t.space[44] },
  "@media": {
    [breakpoints.lg]: { vars: { [layoutPadding]: t.space[28] } },
    [breakpoints.md]: { vars: { [layoutPadding]: t.space[12] } },
    [breakpoints.sm]: { vars: { [layoutPadding]: t.space[8] } },
    [breakpoints.xs]: { vars: { [layoutPadding]: t.space[4] } },
  },
});
