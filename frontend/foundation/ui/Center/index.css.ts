import { recipe } from "@vanilla-extract/recipes";

export const sCenter = recipe({
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
