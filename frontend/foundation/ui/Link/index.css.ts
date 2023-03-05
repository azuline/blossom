import { t } from "@foundation/style";
import { style } from "@vanilla-extract/css";

export const sLink = style({
  color: t.color.content.brand.default,
  textDecoration: "underline",
  ":hover": {
    color: t.color.content.brand.hover,
  },
});
