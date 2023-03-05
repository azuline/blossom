import { t } from "@foundation/style";
import { sx } from "@foundation/style/sprinkles.css";
import { createVar } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const sCheckboxLayout = recipe({
  base: sx({ display: "flex", align: "center", gap: "8", cursor: "pointer" }),
  variants: {
    disabled: { true: { cursor: "not-allowed" } },
  },
});

const checkedBackgroundColor = createVar();
const checkedBackgroundHoverColor = createVar();
const checkedBackgroundActiveColor = createVar();
const checkedColor = createVar();
const uncheckedBorderColor = createVar();

export const sCheckboxBox = recipe({
  base: {
    transition: t.transition.easeOut.fast,
    width: t.size[20],
    height: t.size[20],
    borderRadius: t.radius[6],
  },
  variants: {
    checked: {
      true: {
        background: checkedBackgroundColor,
        color: checkedColor,
        selectors: {
          [`${sCheckboxLayout()}:hover &`]: {
            background: checkedBackgroundHoverColor,
          },
          [`${sCheckboxLayout()}:active &`]: {
            background: checkedBackgroundActiveColor,
          },
        },
      },
      false: {
        borderWidth: t.border[1],
        borderColor: uncheckedBorderColor,
        selectors: {
          [`${sCheckboxLayout()}:hover &`]: {
            background: t.color.background.overlay.hover,
          },
          [`${sCheckboxLayout()}:active &`]: {
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
          [uncheckedBorderColor]: t.color.border.negative.default,
        },
      },
      false: {
        vars: {
          [checkedBackgroundColor]: t.color.background.brand.default,
          [checkedColor]: t.color.content.brand.tint,
          [checkedBackgroundHoverColor]: t.color.background.brand.hover,
          [checkedBackgroundActiveColor]: t.color.background.brand.active,
          [uncheckedBorderColor]: t.color.border.neutral.strong,
        },
      },
    },
    disabled: {
      true: {
        background: t.color.background.neutral.base,
        borderWidth: t.border[1],
        borderColor: t.color.border.neutral.weak,
        color: t.color.content.neutral.weak,
        selectors: {
          [`${sCheckboxLayout()}:hover &`]: {
            background: t.color.background.neutral.base,
          },
          [`${sCheckboxLayout()}:active &`]: {
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
