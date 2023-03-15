import { flattenRecord } from "@foundation/std/flattenRecord";
import { themeMoonlightLightVars } from "@foundation/theme/themes/color.css";
import { breakpoints, themeSharedVars } from "@foundation/theme/themes/shared.css";
import { fontFaces, themeTypeVars } from "@foundation/theme/themes/type.css";
import { CSSProperties } from "react";

const borderColors = flattenRecord(themeMoonlightLightVars.color.border);

/**
 * This function takes in border variables and creates a border CSS value.
 */
const border = (
  size: keyof typeof themeSharedVars.border,
  color: keyof typeof borderColors,
): string => {
  return `${t.border[size]} solid ${borderColors[color]}`;
};

const bodyVariants = ["lg", "md", "sm", "xs"] as const;
const displayVariants = ["disp-xxl", "disp-xl", "disp-lg", "disp-md", "disp-sm"] as const;
const codeVariants = ["code-lg", "code-md", "code-sm", "code-xs"] as const;

export type FontBodyVariant = typeof bodyVariants[number];
export type FontDisplayVariant = typeof displayVariants[number];
export type FontCodeVariant = typeof codeVariants[number];
export type FontVariant = FontBodyVariant | FontDisplayVariant | FontCodeVariant;

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
  let face: keyof typeof fontFaces = "body";
  if (displayVariants.includes(variant)) {
    face = "display";
  }
  if (codeVariants.includes(variant)) {
    face = "code";
  }
  const weights = themeTypeVars.font.weight[face];

  const fontFamily = themeTypeVars.font.face[face];
  const fontWeight = options.strong === true
    ? weights.strong
    : weights.default;
  const lineHeight = options.paragraph === true && bodyVariants.includes(variant)
    ? themeTypeVars.font.lineHeight.paragraph[variant as FontBodyVariant]
    : themeTypeVars.font.lineHeight.label;
  const fontSize = {
    sm: themeTypeVars.font.size.sm,
    xs: themeTypeVars.font.size.xs,
    md: themeTypeVars.font.size.md,
    lg: themeTypeVars.font.size.lg,
    "code-sm": themeTypeVars.font.size.sm,
    "code-xs": themeTypeVars.font.size.xs,
    "code-md": themeTypeVars.font.size.md,
    "code-lg": themeTypeVars.font.size.lg,
    "disp-sm": themeTypeVars.font.size.sm,
    "disp-xs": themeTypeVars.font.size.xs,
    "disp-md": themeTypeVars.font.size.md,
    "disp-lg": themeTypeVars.font.size.lg,
    "disp-xl": themeTypeVars.font.size.xl,
    "disp-xxl": themeTypeVars.font.size.xxl,
  }[variant];
  const fontStyle = options.italic === true ? "italic" : undefined;
  const textDecoration = options.underline === true ? "underline" : undefined;
  const textDecorationColor = options.underline === true
    ? themeMoonlightLightVars.color.content.neutral.weak
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

type Space = keyof typeof themeSharedVars.space;

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
  ...themeSharedVars,
  ...themeTypeVars,
  ...themeMoonlightLightVars,
  breakpoints,
  fn: {
    border,
    font,
    space,
  },
} as const;
