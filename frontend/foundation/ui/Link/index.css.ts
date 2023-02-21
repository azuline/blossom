import { t } from "@foundation/style/theme.css";
import { style } from "@vanilla-extract/css";

export const sLink = style({
  color: t.color.content.brand.default,
  textDecoration: "underline",
  ":hover": {
    color: t.color.content.brand.hover,
  },
});
