import { t } from "@foundation/theme";
import { style } from "@vanilla-extract/css";

export const sPropsTable = style({
  display: "grid",
  grid: `auto-flow max-content / repeat(4, max-content)`,
  width: "fit-content",
  maxWidth: t.size[920],
  border: t.fn.border("1", "neutral.default"),
  borderRadius: t.radius[6],
  overflow: "hidden",
});

export const sPropsTableChild = style({
  padding: t.fn.space("4", "12"),
  borderTop: t.fn.border("1", "neutral.default"),
  borderRight: t.fn.border("1", "neutral.default"),
  maxWidth: t.size[272],

  selectors: {
    "&:nth-child(4n+4)": { borderRight: "none" },
    "&:nth-child(1),&:nth-child(2),&:nth-child(3),&:nth-child(4)": { borderTop: "none" },
  },
});
