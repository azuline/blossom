import { t } from "@foundation/style/index.css";
import { createVar, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const variantColor = createVar();
export const hoverColor = createVar();

export const sButton = recipe({
  base: {
    borderRadius: t.radius.circle,
    cursor: "pointer",
    position: "relative",
    selectors: {
      "&:hover::before": {
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
    variant: {
      solid: {
        color: t.color.content.neutral[7],
        background: variantColor,
        selectors: {
          "&:hover::before": {
            background: hoverColor,
          },
        },
      },
      outline: {
        color: variantColor,
        borderColor: variantColor,
        borderWidth: t.border[2],
        selectors: {
          "&:hover::before": {
            background: t.color.hover.neutral,
          },
        },
      },
      text: {
        color: variantColor,
        selectors: {
          "&:hover::before": {
            background: t.color.hover.neutral,
          },
        },
      },
    },
    color: {
      primary: {
        vars: {
          [variantColor]: t.color.bg.primary,
          [hoverColor]: t.color.hover.primary,
        },
      },
      neutral: {
        vars: {
          [variantColor]: t.color.bg.neutral[5],
          [hoverColor]: t.color.hover.neutral,
        },
      },
      danger: {
        vars: {
          [variantColor]: t.color.bg.danger,
          [hoverColor]: t.color.hover.danger,
        },
      },
      disabled: {
        cursor: "not-allowed",
        vars: { [variantColor]: t.color.bg.neutral[4] },
      },
    },
    size: {
      sm: {
        padding: `${t.space[4]} ${t.space[5]}`,
        fontSize: t.font.size.sm,
      },
      md: {
        padding: `${t.space[5]} ${t.space[7]}`,
      },
      lg: {
        padding: `${t.space[6]} ${t.space[8]}`,
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
    variant: "solid",
    color: "primary",
    size: "md",
    fullWidth: false,
    fullHeight: false,
  },
});

export const sButtonGallery = style({
  display: "grid",
  grid: "auto-flow 1fr / repeat(3, 1fr)",
  gap: t.space[4],
  alignItems: "center",
});
