import { ColorBorder, Space, SX, sx } from "@foundation/theme/styles/sprinkles.css";
import { Divider } from "@foundation/ui/Divider";
import { sStack } from "@foundation/ui/Stack/index.css";
import { PolymorphicProp } from "@foundation/ui/types";
import { View } from "@foundation/ui/View";
import { RecipeVariants } from "@vanilla-extract/recipes";
import { clsx } from "clsx";
import { Children, CSSProperties } from "react";

type RV = Exclude<RecipeVariants<typeof sStack>, undefined>;

export type StackProps = PolymorphicProp & Omit<RV, "axis"> & {
  // Make this prop mandatory.
  axis: Exclude<RV["axis"], undefined>;

  divider?: ColorBorder;
  gap?: Space;

  /** Standard props. */
  className?: string;
  sx?: SX;
  children?: React.ReactNode;
  id?: string;
  style?: CSSProperties;
};

export const Stack: React.FC<StackProps> = props => {
  const {
    axis,
    x = "center",
    y = "center",
    divider,
    wrap = false,
    gap,
    className,
    sx: sxArgs,
    as,
    id,
    style,
    children,
    ...passthru
  } = props;

  return (
    <View
      {...passthru}
      as={as}
      className={clsx(sStack({ axis, x, y, wrap }), gap && sx({ gap }), className)}
      id={id}
      style={style}
      sx={sxArgs}
    >
      {Children.map(children, (c, idx) => (
        <>
          {divider && idx !== 0 && (
            <Divider color={divider} orientation={axis === "x" ? "vertical" : "horizontal"} />
          )}
          {c}
        </>
      ))}
    </View>
  );
};
