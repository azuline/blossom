import { layoutPadding } from "@foundation/layout/LayoutPadding/index.css";
import { t } from "@foundation/style";
import { style } from "@vanilla-extract/css";

export const sHeaderLayout = style({
  height: t.size[96],
  padding: `0px ${layoutPadding}`,
});

export const sLogoFont = style({
  fontFamily: t.font.face.display,
  fontWeight: "Light",
  fontSize: t.font.size.lg,
  fontStyle: "italic",
});
