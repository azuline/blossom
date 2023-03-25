import { ColorBorder, Space, SX, sx } from "@foundation/theme";
import { Divider } from "@foundation/ui";
import { sStack } from "@foundation/ui";
import { PolymorphicProp } from "@foundation/ui";
import { View } from "@foundation/ui";
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
    x,
    y,
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

  // The cross-axis should default to stretch, a la Flexbox.
  const defaultX = axis === "x" ? "left" : "stretch";
  const defaultY = axis === "y" ? "top" : "stretch";

  return (
    <View
      {...passthru}
      as={as}
      className={clsx(
        sStack({ axis, x: x ?? defaultX, y: y ?? defaultY, wrap }),
        sx({ gap, ...sxArgs }),
        className,
      )}
      id={id}
      style={style}
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
