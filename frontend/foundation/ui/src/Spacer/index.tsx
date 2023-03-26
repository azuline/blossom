import { setSXVars, SX } from "@foundation/theme";
import { spacerXVar, spacerYVar, sSpacer } from "./index.css";
import { View } from "../View";
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
      className={clsx(className, sSpacer({ x, y }))}
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
