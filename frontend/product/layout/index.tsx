import { View } from "@foundation/ui/View";

type Props = {
  children: React.ReactNode;
};

export const ApplicationLayout: React.FC<Props> = props => {
  return <View sx={{ h: "full", p: "5" }}>{props.children}</View>;
};
