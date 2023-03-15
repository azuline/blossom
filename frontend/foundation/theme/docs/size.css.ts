import { t } from "@foundation/theme/styles";
import { style } from "@vanilla-extract/css";

export const sSizeScale = style({
  width: "100%",
  display: "grid",
  grid: "auto-flow max-content / max-content 1fr",
  gap: t.fn.space("12", "16"),
});
