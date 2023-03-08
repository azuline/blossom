import { t } from "@foundation/style";
import { createVar, style } from "@vanilla-extract/css";

export const sVariantsGalleryColumns = createVar();

export const sVariantsGallery = style({
  display: "grid",
  grid: `auto-flow max-content / repeat(${sVariantsGalleryColumns}, max-content)`,
  gap: `${t.space[28]} ${t.space[36]}`,
  alignItems: "center",
  justifyItems: "center",
});
