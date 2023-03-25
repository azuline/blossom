import { FontCodeVariant, t } from "@foundation/theme/styles";
import { Type } from "@foundation/ui/Type";
import { View } from "@foundation/ui/View";
import { FC } from "react";

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
