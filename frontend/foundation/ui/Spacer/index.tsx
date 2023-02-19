import { SX } from "@foundation/style/sprinkles.css";
import { setSXVars } from "@foundation/style/utils";
import { spacerXVar, spacerYVar, sSpacer } from "@foundation/ui/Spacer/index.css";
import { View } from "@foundation/ui/View";
import { RecipeVariants } from "@vanilla-extract/recipes";
import clsx from "clsx";

type Props = RecipeVariants<typeof sSpacer> & {
  className?: string;
  sx?: SX;
  vars?: { x?: string; y?: string };
  children?: React.ReactNode;
};

export const Spacer: React.FC<Props> = props => {
  const { className, x, y, vars, sx, children, ...passthru } = props;
  return (
    <View
      {...passthru}
      className={clsx(
        className,
        sSpacer({ x, y }),
      )}
      style={setSXVars({
        [spacerXVar]: vars?.x,
        [spacerYVar]: vars?.y,
      })}
      sx={sx}
    >
      {children}
    </View>
  );
};
