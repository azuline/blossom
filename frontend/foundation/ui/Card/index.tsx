import { SX } from "@foundation/theme/styles/sprinkles.css";
import { sCard } from "@foundation/ui/Card/index.css";
import { View } from "@foundation/ui/View";
import { RecipeVariants } from "@vanilla-extract/recipes";
import clsx from "clsx";
import { ReactNode } from "react";

type Props = RecipeVariants<typeof sCard> & {
  className?: string;
  sx?: SX;
  children: ReactNode;
};

export const Card: React.FC<Props> = props => {
  const { variant, padding, sx, className, children, ...passthru } = props;
  return (
    <View
      {...passthru}
      className={clsx(className, sCard({ variant, padding }))}
      sx={sx}
    >
      {children}
    </View>
  );
};
