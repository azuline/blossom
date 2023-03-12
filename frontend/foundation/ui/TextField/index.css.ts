import { t } from "@foundation/theme/styles";
import { sx } from "@foundation/theme/styles/sprinkles.css";
import { recipe } from "@vanilla-extract/recipes";

export const sTextField = recipe({
  base: [
    sx({
      w: "full",
      px: "12",
      py: "8",
      radius: "8",
    }),
    {
      border: t.fn.border("1", "neutral.weak"),
    },
  ],
  variants: {
    disabled: {
      true: {
        cursor: "not-allowed",
      },
      false: {
        boxShadow: t.shadows.elevate.sm,
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
