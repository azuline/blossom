import { sx } from "@foundation/theme/styles/sprinkles.css";
import { t } from "@foundation/theme/styles/theme";
import { recipe } from "@vanilla-extract/recipes";

export const sTextField = recipe({
  base: sx({
    w: "full",
    px: "12",
    py: "8",
    bcol: "neutral.default",
    bwidth: "1",
    radius: "8",
  }),
  variants: {
    disabled: {
      true: {
        cursor: "not-allowed",
        borderColor: t.color.border.neutral.weak,
      },
    },
    error: {
      true: {
        borderColor: t.color.border.negative.default,
        ":focus-visible": {
          outline: t.outline.error.value,
        },
      },
    },
  },
});
