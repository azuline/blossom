import { DocumentationStory } from "@foundation/stories/components/DocumentationStory";
import { CodeBlock } from "@foundation/ui";
import { FC } from "react";

export default {
  title: "Atoms",
};

export const CodeBlock_: FC = () => (
  <DocumentationStory>
    <CodeBlock
      code={`
export const CodeBlock: FC<Props> = props => (
  <View
    style={{ borderLeft: t.fn.border("4", "neutral.weak") }}
    sx={{
      w: "full",
      h: "fit-content",
      background: "neutral.inset",
      overflowX: "auto",
      p: "16",
    }}
  >
    <Type paragraph style={{ whiteSpace: "pre" }} variant={props.type ?? "code-sm"}>
      {props.code.trim()}
    </Type>
  </View>
);
`}
    />
  </DocumentationStory>
);
