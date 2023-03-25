import { SX, sx } from "@foundation/theme";
import { sCenter } from "@foundation/ui";
import { PolymorphicProp } from "@foundation/ui";
import { View } from "@foundation/ui";
import { RecipeVariants } from "@vanilla-extract/recipes";
import clsx from "clsx";
import { ReactNode } from "react";

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
