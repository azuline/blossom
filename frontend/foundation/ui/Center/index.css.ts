import { sx } from "@foundation/style/index.css";
import { recipe } from "@vanilla-extract/recipes";

export const sCenter = recipe({
  base: sx({ disp: "flex", justify: "center", align: "center" }),
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
