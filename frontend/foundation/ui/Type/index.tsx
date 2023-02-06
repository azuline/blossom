import { SX } from "@foundation/style/index.css";
import { PolymorphicProp } from "@foundation/ui/types";
import { View } from "@foundation/ui/View";

type Props = PolymorphicProp & {
  className?: string;
  sx?: SX;
  children?: React.ReactNode;
};

export const Type: React.FC<Props> = props => {
  const { as = "span", className, sx, children, ...passthru } = props;
  return (
    <View
      {...passthru}
      as={as}
      className={className}
      sx={{ disp: "inline", ...sx }}
    >
      {children}
    </View>
  );
};
