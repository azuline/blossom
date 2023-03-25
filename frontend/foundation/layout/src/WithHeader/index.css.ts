import { layoutPadding } from "@foundation/layout";
import { t } from "@foundation/theme";
import { style } from "@vanilla-extract/css";

export const HEADER_HEIGHT = t.size[64];

export const sHeaderLayout = style({
  paddingLeft: layoutPadding,
  paddingRight: layoutPadding,
  paddingTop: "22px",
  paddingBottom: "14px",
  height: HEADER_HEIGHT,
  width: t.size.full,
  background: t.color.background.neutral.base,
});

export const sLogoFont = style({
  ...t.fn.font("disp-md", { italic: true }),
  color: t.color.content.brand.default,
  lineHeight: t.font.size.body.sm,
  // So that the baselines match up:
  //   size.md - size.sm = 20 - 16 = 4
  marginBottom: "4px",
});
