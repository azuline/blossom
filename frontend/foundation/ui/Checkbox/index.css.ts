import { sx, t } from "@foundation/style/index.css";
import { recipe } from "@vanilla-extract/recipes";

export const sCheckbox = recipe({
  base: [
    sx({ w: "7", h: "7", radius: "6", bcol: "neutral.2", bwidth: "1" }),
    { transition: "all 0.1s ease-out" },
  ],
  variants: {
    checked: {
      true: {
        background: t.color.bg.primary,
        borderColor: t.color.bg.primary,
        color: t.color.content.neutral[7],
      },
    },
    disabled: {
      true: {
        background: t.color.bg.neutral[3],
        borderColor: t.color.border.neutral[3],
        color: t.color.content.neutral[4],
      },
    },
    focused: {
      true: {
        outline: t.color.border.focus,
      },
    },
  },
});
