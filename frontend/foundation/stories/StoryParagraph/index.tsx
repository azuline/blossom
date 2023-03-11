import { FC, ReactNode } from "react";

import { Type } from "@foundation/ui/Type";
import { View } from "@foundation/ui/View";

type Props = { children: ReactNode };

export const StoryParagraph: FC<Props> = props => (
  <View sx={{ maxw: "480" }}>
    <Type paragraph>{props.children}</Type>
  </View>
);
