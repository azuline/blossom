import { t } from "@foundation/theme/styles";
import { sx } from "@foundation/theme/styles/sprinkles.css";
import { recipe } from "@vanilla-extract/recipes";

export const sCard = recipe({
  base: sx({ bwidth: "1", bcol: "neutral.default", radius: "8", shadow: "weak" }),
  variants: {
    variant: {
      strong: { background: t.color.background.neutral.raised },
      default: { background: t.color.background.neutral.base },
      inverse: {
        background: t.color.background.inverse.base,
        color: t.color.content.inverse.default,
      },
    },
    padding: {
      none: {},
      sm: { padding: t.space[12] },
      md: { padding: t.space[20] },
      lg: { padding: t.space[36] },
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "sm",
  },
});
