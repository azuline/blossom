import { sx } from "@foundation/style/sprinkles.css";
import { t } from "@foundation/style/theme.css";
import { recipe } from "@vanilla-extract/recipes";

export const sCard = recipe({
  base: sx({ bwidth: "1", bcol: "neutral.default", radius: "8", p: "12", shadow: "weak" }),
  variants: {
    emph: {
      strong: { background: t.color.background.neutral.raised },
      default: { background: t.color.background.neutral.base },
      inverse: {
        background: t.color.background.inverse.base,
        color: t.color.content.inverse.default,
      },
    },
  },
  defaultVariants: {
    emph: "default",
  },
});
