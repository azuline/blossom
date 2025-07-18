import { View } from "@foundation/ui";
import clsx from "clsx";
import { sLayoutPaddingVariables } from "./index.css";

type LayoutPaddingVariableSetterProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Set the variables for the global layout padding. Hoist this up to the top of the
 * application so that other layout components can use the layout padding variables.
 */
export const LayoutPaddingVariableSetter: React.FC<LayoutPaddingVariableSetterProps> = props => {
  return <View className={clsx(sLayoutPaddingVariables, props.className)}>{props.children}</View>;
};
