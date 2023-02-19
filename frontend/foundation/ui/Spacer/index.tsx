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

export const Spacer: React.FC<Props> = props => (
  <View
    {...props}
    className={clsx(
      props.className,
      sSpacer({ x: props.x, y: props.y }),
    )}
    style={setSXVars({
      [spacerXVar]: props.vars?.x,
      [spacerYVar]: props.vars?.y,
    })}
    sx={props.sx}
  >
    {props.children}
  </View>
);
