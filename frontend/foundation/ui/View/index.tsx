import { SX, sx } from "@foundation/style/sprinkles.css";
import { PolymorphicProp } from "@foundation/ui/types";
import clsx from "clsx";
import { CSSProperties } from "react";

type Props = PolymorphicProp & {
  className?: string;
  sx?: SX;
  children?: React.ReactNode;
  style?: CSSProperties;
};

export const View: React.FC<Props> = props => {
  const { as, className, sx: sxArgs = {}, style, children, ...passthru } = props;
  const Component = as ?? "div";
  return (
    <Component
      {...passthru}
      className={clsx(className, sx(sxArgs))}
      style={style}
    >
      {children}
    </Component>
  );
};
