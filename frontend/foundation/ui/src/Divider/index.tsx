import { SX } from "@foundation/theme/styles/sprinkles.css";
import { sDivider } from "@foundation/ui/Divider/index.css";
import { View } from "@foundation/ui/View";
import { RecipeVariants } from "@vanilla-extract/recipes";
import clsx from "clsx";

type Props = RecipeVariants<typeof sDivider> & {
  className?: string;
  sx?: SX;
};

export const Divider: React.FC<Props> = props => {
  return (
    <View
      className={clsx(
        props.className,
        sDivider({
          orientation: props.orientation,
          color: props.color,
          size: props.size,
          mx: props.mx,
          my: props.my,
        }),
      )}
      sx={props.sx}
    />
  );
};
