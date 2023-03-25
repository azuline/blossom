import { t } from "@foundation/theme/styles";
import { createVar, style } from "@vanilla-extract/css";

export const sVariantsGalleryColumns = createVar();

export const sVariantsGallery = style({
  display: "grid",
  grid: `auto-flow max-content / repeat(${sVariantsGalleryColumns}, max-content)`,
  gap: t.fn.space("28", "36"),
  // alignItems and justifyItems are set in the component style prop.
  width: "fit-content",
});
