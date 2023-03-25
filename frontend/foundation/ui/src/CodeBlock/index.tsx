import { FontCodeVariant, t } from "@foundation/theme";
import { Type, View } from "@foundation/ui";
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
