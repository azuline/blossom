import { layoutPadding } from "@foundation/layout/LayoutPaddingVariableSetter/index.css";
import { t } from "@foundation/style";
import { style } from "@vanilla-extract/css";

export const HEADER_HEIGHT = t.size[64];

export const sHeaderLayout = style({
  paddingLeft: layoutPadding,
  paddingRight: layoutPadding,
  paddingTop: t.size[28],
  paddingBottom: t.size[12],
  height: HEADER_HEIGHT,
  background: t.color.background.neutral.base,
});

export const sLogoFont = style({
  fontFamily: t.font.face.display,
  fontWeight: t.font.weight.logo,
  fontSize: t.font.size.md,
  lineHeight: t.font.lineHeight.label,
  fontStyle: "italic",
  // So that the baselines match up:
  //   size.md - size.sm = 20 - 16 = 4
  marginBottom: "4px",
});
