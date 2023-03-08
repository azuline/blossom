import { layoutPadding } from "@foundation/layout/LayoutPadding/index.css";
import { t } from "@foundation/style";
import { style } from "@vanilla-extract/css";

export const sHeaderLayout = style({
  padding: `${t.size[28]} ${layoutPadding} ${t.size[16]}`,
});

export const sLogoFont = style({
  fontFamily: t.font.face.display,
  fontWeight: "Light",
  fontSize: t.font.size.lg,
  fontStyle: "italic",
});
