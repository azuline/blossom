import { style } from "@vanilla-extract/css";
import { t } from "../styles";

export const sSizeScale = style({
  width: "100%",
  display: "grid",
  grid: "auto-flow max-content / max-content 1fr",
  gap: t.fn.space("12", "16"),
});
