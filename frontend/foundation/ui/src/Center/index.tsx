import { SX, sx } from "@foundation/theme";
import { RecipeVariants } from "@vanilla-extract/recipes";
import clsx from "clsx";
import { ReactNode } from "react";
import { PolymorphicProp } from "../types";
import { View } from "../View";
import { sCenter } from "./index.css";

type Props = RecipeVariants<typeof sCenter> & PolymorphicProp & {
  className?: string;
  sx?: SX;
  children: ReactNode;
};

export const Center: React.FC<Props> = props => {
  const { className, axis, as, sx: sxArgs, children, ...passthru } = props;
  return (
    <View
      {...passthru}
      as={as}
      className={clsx(
        className,
        sCenter({ axis }),
        sx({
          display: "flex",
          justify: "center",
          align: "center",
          w: "full",
          h: "full",
          ...sxArgs,
        }),
      )}
    >
      {children}
    </View>
  );
};
