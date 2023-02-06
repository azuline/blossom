import { sx, t } from "@foundation/style/index.css";
import { recipe } from "@vanilla-extract/recipes";

export const sTextField = recipe({
  base: sx({
    w: "full",
    p: "5",
    bcol: "neutral.2",
    bwidth: "1",
    radius: "8",
  }),
  variants: {
    disabled: {
      true: {
        cursor: "not-allowed",
        background: t.color.bg.neutral[3],
      },
    },
    error: {
      true: {
        borderColor: t.color.border.danger,
        ":focus": {
          outline: t.color.border.danger,
        },
      },
    },
  },
});
