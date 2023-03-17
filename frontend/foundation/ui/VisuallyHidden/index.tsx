import { FC, ReactNode } from "react";
import { VisuallyHidden as Raw } from "react-aria";

type Props = {
  children: ReactNode;
};

// We re-export this from our design system because it's useful in product code too.
export const VisuallyHidden: FC<Props> = props => <Raw>{props.children}</Raw>;
