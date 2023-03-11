import { SX } from "@foundation/theme/styles/sprinkles.css";
import { setSXVars } from "@foundation/theme/utils";
import {
  bleedBottomVar,
  bleedLeftVar,
  bleedRightVar,
  bleedTopVar,
  sBleed,
} from "@foundation/ui/Bleed/index.css";
import { View } from "@foundation/ui/View";
import { RecipeVariants } from "@vanilla-extract/recipes";
import clsx from "clsx";

type Props = RecipeVariants<typeof sBleed> & {
  className?: string;
  sx?: SX;
  vars?: { t?: string; r?: string; b?: string; l?: string };
  children?: React.ReactNode;
};

export const Bleed: React.FC<Props> = props => {
  const { m, my, mx, mt, mr, mb, ml, className, vars, sx, children, ...passthru } = props;
  return (
    <View
      {...passthru}
      className={clsx(
        className,
        sBleed({ m, my, mx, mt, mr, mb, ml }),
      )}
      style={setSXVars({
        [bleedTopVar]: vars?.t,
        [bleedRightVar]: vars?.r,
        [bleedBottomVar]: vars?.b,
        [bleedLeftVar]: vars?.l,
      })}
      sx={sx}
    >
      {children}
    </View>
  );
};
