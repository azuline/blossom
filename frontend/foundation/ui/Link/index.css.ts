import { t } from "@foundation/style";
import { recipe } from "@vanilla-extract/recipes";

export const sLink = recipe({
  variants: {
    variant: {
      primary: {
        color: t.color.content.brand.default,
        textDecoration: "underline",
        textDecorationColor: t.color.content.brand.default,
        ":hover": {
          color: t.color.content.brand.hover,
        },
      },
      secondary: {
        textDecoration: "underline",
        textDecorationColor: t.color.content.neutral.weak,
        ":hover": {
          color: t.color.content.neutral.strong,
          textDecorationColor: t.color.content.neutral.strong,
        },
      },
    },
  },
});
