import {
  sLayoutPaddingUse,
  sLayoutPaddingVariables,
} from "@foundation/layout/LayoutPadding/index.css";
import { View } from "@foundation/ui/View";
import { clsx } from "clsx";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export const LayoutPadding: React.FC<Props> = props => {
  return <View className={clsx(sLayoutPaddingUse, props.className)}>{props.children}</View>;
};

export const LayoutPaddingVariableSetter: React.FC<Props> = props => {
  return <View className={clsx(sLayoutPaddingVariables, props.className)}>{props.children}</View>;
};
