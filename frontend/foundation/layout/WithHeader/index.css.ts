import { layoutPadding } from "@foundation/layout/LayoutPadding/index.css";
import { t } from "@foundation/style/theme.css";
import { style } from "@vanilla-extract/css";

export const sHeaderLayout = style({
  height: t.size[96],
  padding: `0px ${layoutPadding}`,
});
