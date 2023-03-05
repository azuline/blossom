import { t } from "@foundation/style";
import { createVar, style } from "@vanilla-extract/css";

export const sStoryGalleryColumns = createVar();

export const sStoryGallery = style({
  display: "grid",
  grid: `auto-flow 1fr / repeat(${sStoryGalleryColumns}, max-content)`,
  gap: `${t.space[16]} ${t.space[36]}`,
  alignItems: "center",
  justifyItems: "center",
});
