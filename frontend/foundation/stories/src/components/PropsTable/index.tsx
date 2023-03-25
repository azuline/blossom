import { StorySection } from "@foundation/stories";
import { SX } from "@foundation/theme";
import { Code, Type, View } from "@foundation/ui";
import { FC, Fragment, ReactNode } from "react";
import { sPropsTable, sPropsTableChild } from "./index.css";

type Arg =
  & {
    name: string;
    default: string | null;
    description: string;
    required?: boolean;
  }
  & ({
    type: string;
    typePlain?: undefined;
  } | {
    type?: undefined;
    typePlain: string;
  });

type Props = {
  args: Arg[];
  title?: string;
};

export const PropsTable: React.FC<Props> = props => (
  <StorySection title={props.title ?? "Props"}>
    <View className={sPropsTable}>
      <PTChild>
        <Type sx={{ color: "neutral.weak" }} variant="xs">
          Property
        </Type>
      </PTChild>
      <PTChild>
        <Type sx={{ color: "neutral.weak" }} variant="xs">
          Type
        </Type>
      </PTChild>
      <PTChild>
        <Type sx={{ color: "neutral.weak" }} variant="xs">
          Default
        </Type>
      </PTChild>
      <PTChild>
        <Type sx={{ color: "neutral.weak" }} variant="xs">
          Description
        </Type>
      </PTChild>
      {props.args.map(arg => (
        <Fragment key={arg.name}>
          <PTChild>
            <Type paragraph sx={{ color: "neutral.strong" }} variant="xs">
              {arg.name}
              {arg.required && <Type sx={{ color: "brand.default" }}>{" *"}</Type>}
            </Type>
          </PTChild>
          <PTChild sx={{ pt: "2" }}>
            {arg.type
              ? <Code paragraph variant="code-xs">{arg.type}</Code>
              : <Type paragraph variant="xs">{arg.typePlain}</Type>}
          </PTChild>
          <PTChild sx={{ pt: "2" }}>
            {arg.default && <Code paragraph variant="code-xs">{arg.default}</Code>}
          </PTChild>
          <PTChild>
            <Type paragraph variant="xs">{arg.description}</Type>
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
  type: "SX",
  default: null,
  description: "Additional styles to apply to the element.",
};
export const propDocAs = {
  name: "as",
  type: "string",
  default: null,
  description: "The semantic HTML tag to render as.",
};
export const propDocClassName = {
  name: "className",
  type: "string",
  default: null,
  description: "A class to add to the element.",
};
export const propDocID = {
  name: "id",
  type: "string",
  default: null,
  description: "An id to add to the element.",
};
export const propDocStyle = {
  name: "style",
  type: "CSSProperties",
  default: null,
  description: "Inline styles to add to the element.",
};
