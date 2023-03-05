import { CSSProperties } from "react";
import { rawTheme as theme } from "./theme.css";

const bodyVariants = ["lg", "md", "sm", "xs"] as const;
const displayVariants = ["disp-xxl", "disp-xl", "disp-lg", "disp-md", "disp-sm"] as const;

export type FontVariant = typeof bodyVariants[number] | typeof displayVariants[number];

export type FontVariantOptions = {
  strong?: boolean;
  italic?: boolean;
  underline?: boolean;
  /**
   * If the text is multi-line paragraph body font. By default, label text has no
   * additional line height, which inhibits readability for multi-line paragraphs. This
   * option adds additional line height for comfortable paragraph reading.
   */
  paragraph?: boolean;
};

/**
 * This function takes in a font variant with options and expands to that variant's CSS.
 */
const font = (variant: FontVariant, options: FontVariantOptions = {}): CSSProperties => {
  const face = displayVariants.includes(variant) ? "display" : "body";
  const weights = theme.font.weight[face];

  const fontFamily = theme.font.face[face];
  const fontWeight = options.strong === true ? weights.strong : weights.default;
  const lineHeight = options.paragraph === true && bodyVariants.includes(variant)
    ? t.font.lineHeight.paragraph[variant]
    : t.font.lineHeight.label;
  const fontSize = {
    sm: theme.font.size.sm,
    xs: theme.font.size.xs,
    md: theme.font.size.md,
    lg: theme.font.size.lg,
    "disp-sm": theme.font.size.sm,
    "disp-xs": theme.font.size.xs,
    "disp-md": theme.font.size.md,
    "disp-lg": theme.font.size.lg,
    "disp-xl": theme.font.size.xl,
    "disp-xxl": theme.font.size.xxl,
  }[variant];
  const fontStyle = options.italic === true ? "italic" : undefined;
  const textDecoration = options.underline === true ? "underline" : undefined;
  const textDecorationColor = options.underline === true
    ? theme.color.content.neutral.weak
    : undefined;

  return {
    fontFamily,
    fontWeight,
    lineHeight,
    fontSize,
    fontStyle,
    textDecoration,
    textDecorationColor,
  };
};

export const t = {
  ...theme,
  fn: {
    font,
  },
} as const;
