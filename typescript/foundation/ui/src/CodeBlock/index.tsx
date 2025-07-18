import { FontCodeVariant, t } from "@foundation/theme";
import { FC } from "react";
import { Type } from "../Type";
import { View } from "../View";

type Props = {
  code: string;
  variant?: FontCodeVariant;
};

export const CodeBlock: FC<Props> = props => (
  <View
    style={{ borderLeft: t.fn.border("4", "neutral.weak") }}
    sx={{
      w: "fit-content",
      p: "16",
      h: "fit-content",
      background: "neutral.inset",
    }}
  >
    <Type paragraph style={{ whiteSpace: "pre" }} variant={props.variant ?? "code-xs"}>
      {props.code.trim()}
    </Type>
  </View>
);
