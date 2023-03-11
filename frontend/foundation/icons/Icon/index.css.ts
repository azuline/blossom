import { t } from "@foundation/theme/styles/theme";
import { style } from "@vanilla-extract/css";

export const sIconGallery = style({
  display: "grid",
  grid: "auto-flow 1fr / repeat(6, 1fr)",
  gap: t.fn.space("28", "8"),
  alignItems: "center",
  whiteSpace: "nowrap",
});
