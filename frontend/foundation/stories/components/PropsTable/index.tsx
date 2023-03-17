import { StorySection } from "@foundation/stories/components/StorySection";
import { SX } from "@foundation/theme/styles/sprinkles.css";
import { Code } from "@foundation/ui/Code";
import { Type } from "@foundation/ui/Type";
import { View } from "@foundation/ui/View";
import { FC, Fragment, ReactNode } from "react";
import { sPropsTable, sPropsTableChild } from "./index.css";

type Arg = {
  name: string;
  type: string;
  default: string | null;
  description: string;
};

type Props = {
  args: Arg[];
  title?: string;
};

export const PropsTable: React.FC<Props> = props => (
  <StorySection title={props.title ?? "Props"}>
    <View className={sPropsTable}>
      <PTChild>
        <Type sx={{ color: "neutral.strong" }} variant="xs">
          Property
        </Type>
      </PTChild>
      <PTChild>
        <Type variant="xs">Type</Type>
      </PTChild>
      <PTChild>
        <Type variant="xs">Default</Type>
      </PTChild>
      <PTChild>
        <Type variant="xs">Description</Type>
      </PTChild>
      {props.args.map(arg => (
        <Fragment key={arg.name}>
          <PTChild>
            <Type paragraph sx={{ color: "neutral.strong" }}>
              {arg.name}
            </Type>
          </PTChild>
          <PTChild sx={{ pt: "2" }}>
            <Code paragraph>{arg.type}</Code>
          </PTChild>
          <PTChild sx={{ pt: "2" }}>
            {arg.default && <Code paragraph>{arg.default}</Code>}
          </PTChild>
          <PTChild>
            <Type paragraph>{arg.description}</Type>
          </PTChild>
        </Fragment>
      ))}
    </View>
  </StorySection>
);

const PTChild: FC<{ children: ReactNode; sx?: SX }> = props => (
  <View className={sPropsTableChild} sx={props.sx}>{props.children}</View>
);

export const propDocChildren = {
  name: "children",
  type: "ReactNode",
  default: null,
  description: "The child elements to render.",
};
export const propDocSX = {
  name: "sx",
  type: "SX | undefined",
  default: "undefined",
  description: "Additional styles to apply to the element.",
};
export const propDocClassName = {
  name: "className",
  type: "string | undefined",
  default: "undefined",
  description: "A class to add to the element.",
};
export const propDocID = {
  name: "id",
  type: "string | undefined",
  default: "undefined",
  description: "An id to add to the element.",
};
