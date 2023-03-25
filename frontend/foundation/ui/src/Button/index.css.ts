import { t } from "@foundation/theme/styles";
import { createVar } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

const background = createVar();
const borderWidth = createVar();
const borderColor = createVar();
const borderColorDisabled = createVar();
const color = createVar();
const colorDisabled = createVar();
const hoverColor = createVar();
const activeColor = createVar();

const backgroundOverlayColor = createVar();

export const sButton = recipe({
  base: {
    whiteSpace: "nowrap",
    borderRadius: t.radius.circle,
    cursor: "pointer",
    position: "relative",
    boxShadow: t.shadows.raise.md,
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
        boxShadow: t.shadows.raise.md,
      },
    },
  },
  variants: {
    disabled: {
      false: {
        background,
        color,
        borderWidth,
        borderColor,
        selectors: {
          "&:hover:not(&.pressed)": {
            boxShadow: "none",
            vars: { [backgroundOverlayColor]: hoverColor },
          },
          "&.pressed": {
            boxShadow: "none",
            vars: { [backgroundOverlayColor]: activeColor },
          },
          "&:hover::before": { display: "block" },
          "&.pressed::before": { display: "block" },
        },
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
          [borderWidth]: t.border[0],
        },
      },
      secondary: {
        vars: {
          [hoverColor]: t.color.background.overlay.hover,
          [activeColor]: t.color.background.overlay.active,
          [color]: t.color.content.neutral.default,
          [colorDisabled]: t.color.content.neutral.weak,
          [borderColorDisabled]: t.color.border.neutral.default,
          [borderWidth]: t.border[1],
          [borderColor]: t.color.border.neutral.weak,
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
          [borderWidth]: t.border[0],
        },
      },
    },
    size: {
      sm: {
        padding: "6px 16px",
        fontSize: t.font.size.body.xs,
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
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
    disabled: false,
    fullWidth: false,
    fullHeight: false,
  },
});
