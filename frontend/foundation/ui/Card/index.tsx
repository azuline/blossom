import { SX } from "@foundation/style/index.css";
import { sCard } from "@foundation/ui/Card/index.css";
import { View } from "@foundation/ui/View";
import { RecipeVariants } from "@vanilla-extract/recipes";
import clsx from "clsx";

type Props = RecipeVariants<typeof sCard> & {
  className?: string;
  sx?: SX;
  children: React.ReactElement | string;
};

export const Card: React.FC<Props> = props => {
  const { emph, sx, className, children, ...passthru } = props;
  return (
    <View
      {...passthru}
      className={clsx(className, sCard({ emph }))}
      sx={sx}
    >
      {children}
    </View>
  );
};
