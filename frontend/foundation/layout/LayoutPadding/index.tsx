import {
  sLayoutPaddingUse,
  sLayoutPaddingVariables,
} from "@foundation/layout/LayoutPadding/index.css";
import { View } from "@foundation/ui/View";

type Props = {
  children: React.ReactNode;
};

export const LayoutPadding: React.FC<Props> = props => {
  return <View className={sLayoutPaddingUse}>{props.children}</View>;
};

export const LayoutPaddingVariableSetter: React.FC<Props> = props => {
  return <View className={sLayoutPaddingVariables}>{props.children}</View>;
};
