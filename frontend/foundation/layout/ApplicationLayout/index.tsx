import { sApplicationLayout } from "@foundation/layout/ApplicationLayout/index.css";
import { View } from "@foundation/ui/View";

type Props = {
  children: React.ReactNode;
};

export const ApplicationLayout: React.FC<Props> = props => {
  return <View className={sApplicationLayout}>{props.children}</View>;
};
