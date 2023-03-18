import { layoutPadding } from "@foundation/layout/LayoutPaddingVariableSetter/index.css";
import { t } from "@foundation/theme/styles";
import { style } from "@vanilla-extract/css";

export const HEADER_HEIGHT = t.size[64];

export const sHeaderLayout = style({
  paddingLeft: layoutPadding,
  paddingRight: layoutPadding,
  paddingTop: t.size[28],
  paddingBottom: t.size[12],
  height: HEADER_HEIGHT,
  width: t.size.full,
  background: t.color.background.neutral.base,
});

export const sLogoFont = style({
  ...t.fn.font("disp-md", { italic: true }),
  color: t.color.content.brand.default,
  // So that the baselines match up:
  //   size.md - size.sm = 20 - 16 = 4
  marginBottom: "4px",
});
