import { LayoutPaddingVariableSetter } from "@foundation/layout/LayoutPaddingVariableSetter";
import { View } from "@foundation/ui/View";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const PageStory: React.FC<Props> = props => (
  <LayoutPaddingVariableSetter>
    <View sx={{ w: "full", h: "full", background: "neutral.base" }}>
      {props.children}
    </View>
  </LayoutPaddingVariableSetter>
);
