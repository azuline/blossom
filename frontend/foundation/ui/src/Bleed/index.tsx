import { SX } from "@foundation/theme/styles/sprinkles.css";
import { setSXVars } from "@foundation/theme/utils";
import {
  bleedBottomVar,
  bleedLeftVar,
  bleedRightVar,
  bleedTopVar,
  sBleed,
} from "@foundation/ui/Bleed/index.css";
import { View } from "@foundation/ui";
import { RecipeVariants } from "@vanilla-extract/recipes";
import clsx from "clsx";
import { CSSProperties, FC } from "react";

type Props = RecipeVariants<typeof sBleed> & {
  vars?: { t?: string; r?: string; b?: string; l?: string };

  /** Standard props. */
  children?: React.ReactNode;
  style?: CSSProperties;
  id?: string;
  className?: string;
  sx?: SX;
};

export const Bleed: FC<Props> = props => {
  const { m, my, mx, mt, mr, mb, ml, id, style, className, vars, sx, children, ...passthru } =
    props;
  return (
    <View
      {...passthru}
      className={clsx(
        className,
        sBleed({ m, my, mx, mt, mr, mb, ml }),
      )}
      id={id}
      style={{
        ...style,
        ...setSXVars({
          [bleedTopVar]: vars?.t,
          [bleedRightVar]: vars?.r,
          [bleedBottomVar]: vars?.b,
          [bleedLeftVar]: vars?.l,
        }),
      }}
      sx={sx}
    >
      {children}
    </View>
  );
};
