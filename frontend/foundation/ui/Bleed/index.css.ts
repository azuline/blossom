import { t } from "@foundation/style/theme.css";
import { mapTokenScale } from "@foundation/style/utils";
import { createVar } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const bleedTopVar = createVar();
export const bleedRightVar = createVar();
export const bleedBottomVar = createVar();
export const bleedLeftVar = createVar();

export const sBleed = recipe({
  base: {
    width: `calc(100% + ${bleedRightVar} + ${bleedLeftVar})`,
    height: `calc(100% + ${bleedTopVar} + ${bleedBottomVar})`,
    marginTop: `calc(${bleedTopVar} * -1)`,
    marginRight: `calc(${bleedRightVar} * -1)`,
    marginBottom: `calc(${bleedBottomVar} * -1)`,
    marginLeft: `calc(${bleedLeftVar} * -1)`,
    vars: {
      [bleedTopVar]: "0px",
      [bleedRightVar]: "0px",
      [bleedBottomVar]: "0px",
      [bleedLeftVar]: "0px",
    },
  },
  variants: {
    m: mapTokenScale(t.space, tok => ({
      vars: {
        [bleedTopVar]: t.space[tok],
        [bleedRightVar]: t.space[tok],
        [bleedBottomVar]: t.space[tok],
        [bleedLeftVar]: t.space[tok],
      },
    })),
    my: mapTokenScale(t.space, tok => ({
      vars: {
        [bleedTopVar]: t.space[tok],
        [bleedBottomVar]: t.space[tok],
      },
    })),
    mx: mapTokenScale(t.space, tok => ({
      vars: {
        [bleedRightVar]: t.space[tok],
        [bleedLeftVar]: t.space[tok],
      },
    })),
    mt: mapTokenScale(t.space, tok => ({
      vars: { [bleedTopVar]: t.space[tok] },
    })),
    mr: mapTokenScale(t.space, tok => ({
      vars: { [bleedRightVar]: t.space[tok] },
    })),
    mb: mapTokenScale(t.space, tok => ({
      vars: { [bleedBottomVar]: t.space[tok] },
    })),
    ml: mapTokenScale(t.space, tok => ({
      vars: { [bleedLeftVar]: t.space[tok] },
    })),
  },
});
