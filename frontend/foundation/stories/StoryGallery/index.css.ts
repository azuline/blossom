import { t } from "@foundation/style/theme.css";
import { createVar, style } from "@vanilla-extract/css";

export const sStoryGalleryColumns = createVar();

export const sStoryGallery = style({
  display: "grid",
  grid: `auto-flow 1fr / repeat(${sStoryGalleryColumns}, min-content)`,
  gap: `${t.space[12]} ${t.space[28]}`,
  alignItems: "center",
  justifyItems: "center",
});
