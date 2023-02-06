import { sx, t } from "@foundation/style/index.css";
import { recipe } from "@vanilla-extract/recipes";

export const sCard = recipe({
  base: sx({ bwidth: "1", bcol: "neutral.4", radius: "8", p: "5", shadow: "light" }),
  variants: {
    emph: {
      "1": { background: t.color.bg.neutral[1] },
      "2": { background: t.color.bg.neutral[2] },
      "3": { background: t.color.bg.neutral[3] },
      inverse: {
        background: t.color.bg.neutral[7],
        color: t.color.content.neutral[7],
      },
    },
  },
  defaultVariants: {
    emph: "1",
  },
});
