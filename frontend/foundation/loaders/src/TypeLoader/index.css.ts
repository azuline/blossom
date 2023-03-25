import { t } from "@foundation/theme";
import { mapTokenScale } from "@foundation/theme";
import { recipe } from "@vanilla-extract/recipes";

export const sTypeLoader = recipe({
  base: {
    borderRadius: t.radius.circle,
    background: t.color.content.neutral.loader,
  },
  variants: {
    size: mapTokenScale(t.font.size.body, tok => ({
      height: t.font.size.body[tok],
    })),
  },
  defaultVariants: {
    size: "sm",
  },
});
