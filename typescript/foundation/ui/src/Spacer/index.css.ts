import { mapTokenScale, t } from "@foundation/theme";
import { createVar, StyleRule } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const spacerXVar = createVar();
export const spacerYVar = createVar();

export const sSpacer = recipe({
  base: {
    paddingLeft: spacerXVar,
    paddingBottom: spacerYVar,
  },
  // We need to do some type casting here because TypeScript infers the string keys as
  // numbers for some reason. Likely a bug in TypeScript.
  variants: {
    x: {
      auto: { marginLeft: "auto" },
      ...mapTokenScale(t.space, tok => ({ vars: { [spacerXVar]: t.space[tok] } })),
    } as Record<"auto" | keyof typeof t.space, StyleRule>,
    y: {
      auto: { marginTop: "auto" },
      ...mapTokenScale(t.space, tok => ({ vars: { [spacerYVar]: t.space[tok] } })),
    } as Record<"auto" | keyof typeof t.space, StyleRule>,
  },
});
