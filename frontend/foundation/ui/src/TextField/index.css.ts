import { t } from "@foundation/theme/styles";
import { recipe } from "@vanilla-extract/recipes";

export const sTextField = recipe({
  base: {
    width: t.size.full,
    padding: t.fn.space("8", "12"),
    borderRadius: t.radius[8],
    border: t.fn.border("1", "neutral.weak"),
  },
  variants: {
    disabled: {
      true: {
        cursor: "not-allowed",
        color: t.color.content.neutral.weak,
      },
      false: {
        boxShadow: t.shadows.raise.sm,
      },
    },
    error: {
      true: {
        border: t.fn.border("1", "negative.default"),
        ":focus-visible": {
          outline: t.outline.error.value,
        },
      },
    },
  },
});
