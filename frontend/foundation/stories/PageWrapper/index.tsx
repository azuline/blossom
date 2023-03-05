import { View } from "@foundation/ui/View";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const PageWrapper: React.FC<Props> = props => (
  <View sx={{ w: "full", h: "full", bcol: "neutral.weak", bwidth: "1" }}>
    {props.children}
  </View>
);
