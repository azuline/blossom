import { flattenRecord } from "@foundation/std";
import { mapTokenScale, t } from "@foundation/theme";
import { createVar } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

const sizeVar = createVar();

const borderColors = flattenRecord(t.color.border);

export const sDivider = recipe({
  base: {
    borderRadius: t.radius.circle,
  },
  variants: {
    orientation: {
      vertical: {
        width: sizeVar,
        height: "100%",
      },
      horizontal: {
        height: sizeVar,
        width: "100%",
      },
    },
    color: mapTokenScale(borderColors, tok => ({ background: borderColors[tok] })),
    size: mapTokenScale(t.border, tok => ({ vars: { [sizeVar]: t.border[tok] } })),
    mx: {
      auto: { marginLeft: "auto", marginRight: "auto" },
      ...mapTokenScale(t.space, tok => ({ marginLeft: t.space[tok], marginRight: t.space[tok] })),
    },
    my: {
      auto: { marginTop: "auto", marginBottom: "auot" },
      ...mapTokenScale(t.space, tok => ({ marginTop: t.space[tok], marginBottom: t.space[tok] })),
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    color: "neutral.default",
    size: "1",
  },
});
