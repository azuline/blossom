import { t } from "@foundation/style";
import { createVar, style } from "@vanilla-extract/css";

export const sVariantsGalleryColumns = createVar();

export const sVariantsGallery = style({
  display: "grid",
  grid: `auto-flow max-content / repeat(${sVariantsGalleryColumns}, max-content)`,
  gap: t.fn.space("28", "36"),
  alignItems: "center",
  justifyItems: "center",
});
