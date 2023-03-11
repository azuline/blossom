import { sx } from "@foundation/theme/styles/sprinkles.css";
import { recipe } from "@vanilla-extract/recipes";

export const sCenter = recipe({
  base: sx({ display: "flex", justify: "center", align: "center", w: "full", h: "full" }),
  variants: {
    axis: {
      horizontal: {
        flexDirection: "row",
        justifyContent: "initial",
        alignItems: "center",
      },
      vertical: {
        flexDirection: "column",
        justifyContent: "initial",
        alignItems: "center",
      },
    },
  },
});
