import { t } from "@foundation/theme/styles/theme";
import { createVar } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const background = createVar();
export const backgroundDisabled = createVar();
export const borderWidth = createVar();
export const borderColor = createVar();
export const borderColorDisabled = createVar();
export const color = createVar();
export const colorDisabled = createVar();
export const hoverColor = createVar();
export const activeColor = createVar();

export const backgroundOverlayColor = createVar();

export const sButton = recipe({
  base: {
    whiteSpace: "nowrap",
    borderRadius: t.radius.circle,
    cursor: "pointer",
    position: "relative",
    selectors: {
      "&::before": {
        position: "absolute",
        top: "0",
        left: "0",
        content: "\" \"",
        width: "100%",
        height: "100%",
        borderRadius: t.radius.circle,
        pointerEvents: "none",
        userSelect: "none",
        background: backgroundOverlayColor,
      },
    },
  },
  variants: {
    disabled: {
      false: {
        background,
        borderColor,
        borderWidth,
        color,
      },
      true: {
        cursor: "not-allowed",
        background: backgroundDisabled,
        color: colorDisabled,
        borderWidth,
        borderColor: borderColorDisabled,
      },
    },
    variant: {
      primary: {
        vars: {
          [background]: t.color.background.brand.default,
          [backgroundDisabled]: t.color.background.brand.disabled,
          [hoverColor]: t.color.background.brand.hover,
          [activeColor]: t.color.background.brand.active,
          [color]: t.color.content.brand.tint,
          [colorDisabled]: t.color.content.brand.disabled,
          [borderWidth]: t.border[0],
        },
      },
      secondary: {
        vars: {
          [hoverColor]: t.color.background.overlay.hover,
          [activeColor]: t.color.background.overlay.active,
          [color]: t.color.content.neutral.default,
          [colorDisabled]: t.color.content.neutral.weak,
          [borderWidth]: t.border[1],
          [borderColor]: t.color.border.neutral.strong,
          [borderColorDisabled]: t.color.border.neutral.default,
        },
      },
      danger: {
        vars: {
          [background]: t.color.background.negative.default,
          [backgroundDisabled]: t.color.background.negative.disabled,
          [hoverColor]: t.color.background.negative.hover,
          [activeColor]: t.color.background.negative.active,
          [color]: t.color.content.negative.tint,
          [colorDisabled]: t.color.content.negative.disabled,
          [borderWidth]: t.border[0],
        },
      },
    },
    size: {
      sm: {
        padding: "6px 16px",
        fontSize: t.font.size.xs,
      },
      md: {
        padding: "8px 20px",
      },
      lg: {
        padding: "12px 32px",
      },
    },
    fullWidth: {
      true: {
        width: "100%",
      },
      false: {
        width: "fit-content",
      },
    },
    fullHeight: {
      true: {
        height: "100%",
      },
      false: {
        height: "fit-content",
      },
    },
    active: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      variants: {
        active: true,
        disabled: false,
      },
      style: {
        vars: { [backgroundOverlayColor]: activeColor },
      },
    },
    {
      variants: {
        active: false,
        disabled: false,
      },
      style: {
        selectors: {
          "&:hover": {
            vars: { [backgroundOverlayColor]: hoverColor },
          },
        },
      },
    },
  ],
  defaultVariants: {
    variant: "primary",
    size: "md",
    disabled: false,
    fullWidth: false,
    fullHeight: false,
  },
});
