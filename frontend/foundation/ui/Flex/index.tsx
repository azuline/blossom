import { SX } from "@foundation/theme/styles/sprinkles.css";
import { PolymorphicProp } from "@foundation/ui/types";
import { View } from "@foundation/ui/View";

type Props = PolymorphicProp & {
  className?: string;
  sx?: SX;
  children?: React.ReactNode;
};

export const Flex: React.FC<Props> = props => {
  const { className, sx, as, children, ...passthru } = props;
  return (
    <View
      {...passthru}
      as={as}
      className={className}
      sx={{ display: "flex", ...sx }}
    >
      {children}
    </View>
  );
};
