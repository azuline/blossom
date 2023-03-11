import { t } from "@foundation/style";
import { mapTokenScale } from "@foundation/style/utils";
import { recipe } from "@vanilla-extract/recipes";

export const sTypeLoader = recipe({
  base: {
    borderRadius: t.radius.circle,
    background: t.color.content.neutral.loader,
  },
  variants: {
    size: mapTokenScale(t.font.size, tok => ({
      height: t.font.size[tok],
    })),
  },
  defaultVariants: {
    size: "sm",
  },
});
