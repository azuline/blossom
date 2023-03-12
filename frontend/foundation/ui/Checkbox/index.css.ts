import { t } from "@foundation/theme/styles";
import { createVar, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const sCheckboxLayout = style({
  display: "flex",
  alignItems: "center",
  gap: t.space[10],
});

const checkedBackgroundColor = createVar();
const checkedBackgroundHoverColor = createVar();
const checkedBackgroundActiveColor = createVar();
const checkedColor = createVar();

export const sCheckboxBox = recipe({
  base: {
    transition: t.transition.easeOut.fast,
    width: t.size[20],
    height: t.size[20],
    padding: "2px 2px 0px 2px",
    borderRadius: t.radius[6],
  },
  variants: {
    checked: {
      true: {
        background: checkedBackgroundColor,
        color: checkedColor,
        boxShadow: t.shadows.raise.sm,
        selectors: {
          [`${sCheckboxLayout}:hover &`]: {
            background: checkedBackgroundHoverColor,
          },
          [`${sCheckboxLayout}:active &`]: {
            boxShadow: t.shadows.inset.sm,
            background: checkedBackgroundActiveColor,
          },
        },
      },
      false: {
        boxShadow: t.shadows.inset.sm,
        border: t.fn.border("1", "neutral.weak"),
        selectors: {
          [`${sCheckboxLayout}:hover &`]: {
            background: t.color.background.overlay.hover,
          },
          [`${sCheckboxLayout}:active &`]: {
            background: t.color.background.overlay.active,
          },
        },
      },
    },
    error: {
      true: {
        vars: {
          [checkedBackgroundColor]: t.color.background.negative.default,
          [checkedColor]: t.color.content.negative.tint,
          [checkedBackgroundHoverColor]: t.color.background.negative.hover,
          [checkedBackgroundActiveColor]: t.color.background.negative.active,
        },
      },
      false: {
        vars: {
          [checkedBackgroundColor]: t.color.background.brand.default,
          [checkedColor]: t.color.content.brand.tint,
          [checkedBackgroundHoverColor]: t.color.background.brand.hover,
          [checkedBackgroundActiveColor]: t.color.background.brand.active,
        },
      },
    },
    disabled: {
      true: {
        background: t.color.background.neutral.base,
        border: t.fn.border("1", "neutral.weak"),
        color: t.color.content.neutral.weak,
        boxShadow: "none",
        selectors: {
          [`${sCheckboxLayout}:hover &`]: {
            background: t.color.background.neutral.base,
          },
          [`${sCheckboxLayout}:active &`]: {
            background: t.color.background.neutral.base,
          },
        },
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
