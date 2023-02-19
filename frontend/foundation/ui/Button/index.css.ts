import { t } from "@foundation/style/theme.css";
import { createVar, style } from "@vanilla-extract/css";
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

export const sButton = recipe({
  base: {
    borderRadius: t.radius.circle,
    cursor: "pointer",
    position: "relative",
    selectors: {
      "&:hover:not(&:active)::before": {
        position: "absolute",
        top: "0",
        left: "0",
        content: "\" \"",
        width: "100%",
        height: "100%",
        borderRadius: t.radius.circle,
        pointerEvents: "none",
        userSelect: "none",
      },
      "&:active::before": {
        position: "absolute",
        top: "0",
        left: "0",
        content: "\" \"",
        width: "100%",
        height: "100%",
        borderRadius: t.radius.circle,
        pointerEvents: "none",
        userSelect: "none",
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
        selectors: {
          "&:hover:not(&:active)::before": { background: hoverColor },
          "&:active::before": { background: activeColor },
        },
      },
      true: {
        cursor: "not-allowed",
        background: backgroundDisabled,
        color: colorDisabled,
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
          [backgroundDisabled]: t.color.background.neutral.weak,
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
        fontSize: t.font.size.sm,
      },
      md: {
        padding: "10px 24px",
      },
      lg: {
        padding: "14px 32px",
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
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
    disabled: false,
    fullWidth: false,
    fullHeight: false,
  },
});

export const sButtonGallery = style({
  display: "grid",
  grid: "auto-flow 1fr / repeat(6, 1fr)",
  gap: t.space[8],
  alignItems: "center",
});
