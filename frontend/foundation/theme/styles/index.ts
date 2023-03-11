import { flattenRecord } from "@foundation/lib/flattenRecord";
import { themeMoonlightLight } from "@foundation/theme/styles/themes/color.css";
import { themeType } from "@foundation/theme/styles/themes/type.css";
import { CSSProperties } from "react";
import { breakpoints, themeShared } from "./themes/shared.css";

const borderColors = flattenRecord(themeMoonlightLight.color.border);

/**
 * This function takes in border variables and creates a border CSS value.
 */
const border = (
  size: keyof typeof themeShared.border,
  color: keyof typeof borderColors,
): string => {
  return `${t.border[size]} solid ${borderColors[color]}`;
};

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
  const weights = themeType.font.weight[face];

  const fontFamily = themeType.font.face[face];
  const fontWeight = options.strong === true ? weights.strong : weights.default;
  const lineHeight = options.paragraph === true && bodyVariants.includes(variant)
    ? themeType.font.lineHeight.paragraph[variant]
    : themeType.font.lineHeight.label;
  const fontSize = {
    sm: themeType.font.size.sm,
    xs: themeType.font.size.xs,
    md: themeType.font.size.md,
    lg: themeType.font.size.lg,
    "disp-sm": themeType.font.size.sm,
    "disp-xs": themeType.font.size.xs,
    "disp-md": themeType.font.size.md,
    "disp-lg": themeType.font.size.lg,
    "disp-xl": themeType.font.size.xl,
    "disp-xxl": themeType.font.size.xxl,
  }[variant];
  const fontStyle = options.italic === true ? "italic" : undefined;
  const textDecoration = options.underline === true ? "underline" : undefined;
  const textDecorationColor = options.underline === true
    ? themeMoonlightLight.color.content.neutral.weak
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

type Space = keyof typeof themeShared.space;

/**
 * This function takes in a sequence of space values and produces a single output CSS value.
 */
const space = (a: Space, b?: Space, c?: Space, d?: Space): string => {
  if (a && b && c && d) {
    return `${t.space[a]} ${t.space[b]} ${t.space[c]} ${t.space[d]}`;
  }
  if (a && b && c) {
    return `${t.space[a]} ${t.space[b]} ${t.space[c]}`;
  }
  if (a && b) {
    return `${t.space[a]} ${t.space[b]}`;
  }
  return `${t.space[a]}`;
};

export const t = {
  ...themeShared,
  ...themeType,
  ...themeMoonlightLight,
  breakpoints,
  fn: {
    border,
    font,
    space,
  },
} as const;
