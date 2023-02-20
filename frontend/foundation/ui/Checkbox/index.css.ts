import { sx } from "@foundation/style/sprinkles.css";
import { t } from "@foundation/style/theme.css";
import { recipe } from "@vanilla-extract/recipes";

export const sCheckbox = recipe({
  base: [
    sx({ w: "20", h: "20", radius: "6", bcol: "neutral.strong", bwidth: "1" }),
    { transition: "all 0.1s ease-out" },
  ],
  variants: {
    checked: {
      true: {
        background: t.color.background.brand.default,
        borderColor: t.color.background.brand.default,
        color: t.color.content.brand.tint,
      },
    },
    disabled: {
      true: {
        background: t.color.background.neutral.default,
        borderColor: t.color.border.neutral.weak,
        color: t.color.content.neutral.weak,
      },
    },
    focused: {
      true: {
        outline: t.outline.focus.value,
        outlineOffset: t.outline.focus.offset,
      },
    },
  },
});
