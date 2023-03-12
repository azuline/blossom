import { t } from "@foundation/theme/styles";
import { createVar } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const background = createVar();
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
    boxShadow: t.shadows.elevate.md,
    selectors: {
      "&::before": {
        position: "absolute",
        display: "none",
        top: "0",
        left: "0",
        content: "\" \"",
        width: "100%",
        height: "100%",
        borderRadius: t.radius.circle,
        pointerEvents: "none",
        userSelect: "none",
        background: backgroundOverlayColor,
        boxShadow: t.shadows.elevate.md,
      },
    },
  },
  variants: {
    disabled: {
      false: {
        background,
        color,
      },
      true: {
        cursor: "not-allowed",
        color: colorDisabled,
        borderWidth: t.border[1],
        borderColor: borderColorDisabled,
        boxShadow: "none",
      },
    },
    variant: {
      primary: {
        vars: {
          [background]: t.color.background.brand.default,
          [hoverColor]: t.color.background.brand.hover,
          [activeColor]: t.color.background.brand.active,
          [color]: t.color.content.brand.tint,
          [colorDisabled]: t.color.content.brand.disabled,
          [borderColorDisabled]: t.color.border.brand.disabled,
        },
      },
      secondary: {
        vars: {
          [hoverColor]: t.color.background.overlay.hover,
          [activeColor]: t.color.background.overlay.active,
          [color]: t.color.content.neutral.default,
          [colorDisabled]: t.color.content.neutral.weak,
          [borderColorDisabled]: t.color.border.neutral.default,
        },
      },
      danger: {
        vars: {
          [background]: t.color.background.negative.default,
          [hoverColor]: t.color.background.negative.hover,
          [activeColor]: t.color.background.negative.active,
          [color]: t.color.content.negative.tint,
          [colorDisabled]: t.color.content.negative.disabled,
          [borderColorDisabled]: t.color.border.negative.disabled,
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
        boxShadow: "none",
        vars: { [backgroundOverlayColor]: activeColor },
        selectors: {
          "&::before": { display: "block" },
        },
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
            boxShadow: "none",
            vars: { [backgroundOverlayColor]: hoverColor },
          },
          "&:hover::before": { display: "block" },
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
