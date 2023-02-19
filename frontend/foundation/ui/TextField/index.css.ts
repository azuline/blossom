import { sx } from "@foundation/style/sprinkles.css";
import { t } from "@foundation/style/theme.css";
import { recipe } from "@vanilla-extract/recipes";

export const sTextField = recipe({
  base: sx({
    w: "full",
    p: "12",
    bcol: "neutral.strong",
    bwidth: "1",
    radius: "8",
  }),
  variants: {
    disabled: {
      true: {
        cursor: "not-allowed",
        background: t.color.background.neutral.weak,
      },
    },
    error: {
      true: {
        borderColor: t.color.border.negative.default,
      },
    },
  },
});
