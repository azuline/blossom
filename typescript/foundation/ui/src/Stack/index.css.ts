import { recipe } from "@vanilla-extract/recipes";

export const sStack = recipe({
  base: {
    display: "flex",
  },
  variants: {
    axis: {
      x: { flexDirection: "row" },
      y: { flexDirection: "column" },
    },
    x: { left: {}, center: {}, right: {}, space: {}, stretch: {} },
    y: { top: {}, center: {}, bottom: {}, space: {}, stretch: {} },
    wrap: { true: { flexWrap: "wrap" } },
  },
  compoundVariants: [
    { variants: { axis: "x", x: "left" }, style: { justifyContent: "flex-start" } },
    { variants: { axis: "x", x: "center" }, style: { justifyContent: "center" } },
    { variants: { axis: "x", x: "right" }, style: { justifyContent: "flex-end" } },
    { variants: { axis: "x", x: "space" }, style: { justifyContent: "space-between" } },
    { variants: { axis: "x", y: "top" }, style: { alignItems: "flex-start" } },
    { variants: { axis: "x", y: "center" }, style: { alignItems: "center" } },
    { variants: { axis: "x", y: "bottom" }, style: { alignItems: "flex-end" } },
    { variants: { axis: "x", y: "stretch" }, style: { alignItems: "stretch" } },

    { variants: { axis: "y", x: "left" }, style: { alignItems: "flex-start" } },
    { variants: { axis: "y", x: "center" }, style: { alignItems: "center" } },
    { variants: { axis: "y", x: "right" }, style: { alignItems: "flex-end" } },
    { variants: { axis: "y", x: "stretch" }, style: { alignItems: "stretch" } },
    { variants: { axis: "y", y: "top" }, style: { justifyContent: "flex-start" } },
    { variants: { axis: "y", y: "center" }, style: { justifyContent: "center" } },
    { variants: { axis: "y", y: "bottom" }, style: { justifyContent: "flex-end" } },
    { variants: { axis: "y", y: "space" }, style: { justifyContent: "space-between" } },
  ],
});
