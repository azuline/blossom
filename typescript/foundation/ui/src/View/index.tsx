import { SX, sx } from "@foundation/theme";
import clsx from "clsx";
import { CSSProperties, forwardRef } from "react";
import { PolymorphicProp } from "../types";

type Props = PolymorphicProp & {
  className?: string;
  sx?: SX;
  children?: React.ReactNode;
  style?: CSSProperties;
  id?: string;
};

export const View = forwardRef(function ViewWithRef(props: Props, ref) {
  const { as, className, sx: sxArgs = {}, style, children, ...passthru } = props;
  const Component = as ?? "div";
  return (
    <Component
      {...passthru}
      ref={ref}
      className={clsx(className, sx(sxArgs))}
      id={props.id}
      style={style}
    >
      {children}
    </Component>
  );
});
