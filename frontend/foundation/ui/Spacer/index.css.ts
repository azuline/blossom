import { t } from "@foundation/theme/styles/theme";
import { mapTokenScale } from "@foundation/theme/utils";
import { createVar } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const spacerXVar = createVar();
export const spacerYVar = createVar();

export const sSpacer = recipe({
  base: {
    paddingLeft: spacerXVar,
    paddingBottom: spacerYVar,
  },
  variants: {
    x: {
      auto: { marginLeft: "auto" },
      ...mapTokenScale(t.space, tok => ({ vars: { [spacerXVar]: t.space[tok] } })),
    },
    y: {
      auto: { marginTop: "auto" },
      ...mapTokenScale(t.space, tok => ({ vars: { [spacerYVar]: t.space[tok] } })),
    },
  },
});
