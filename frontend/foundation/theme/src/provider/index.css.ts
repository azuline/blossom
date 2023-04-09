import { style } from "@vanilla-extract/css";
import { t } from "../styles";

export const sThemeProvider = style({
  fontFamily: `${t.font.face.body}, sans-serif`,
  fontWeight: t.font.weight.body.default,
  lineHeight: t.font.lineHeight.label,
  fontSize: t.font.size.body.sm,
  color: t.color.content.neutral.default,
});
