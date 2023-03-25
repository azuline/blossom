import { DocumentationStory } from "@foundation/stories";
import {
  propDocAs,
  propDocChildren,
  propDocClassName,
  propDocID,
  propDocStyle,
  propDocSX,
  PropsTable,
} from "@foundation/stories";
import { StoryParagraph } from "@foundation/stories";
import { StorySection } from "@foundation/stories";
import { Variant, VariantGroup } from "@foundation/stories";
import { VariantsGallery } from "@foundation/stories";
import { t } from "@foundation/theme";
import { SX } from "@foundation/theme";
import { Center } from "@foundation/ui";
import { Code } from "@foundation/ui";
import { Stack, StackProps } from "@foundation/ui";
import { Type } from "@foundation/ui";
import { FC, ReactNode } from "react";

export default {
  title: "Layout",
};

export const Stack_: React.FC = () => (
  <DocumentationStory>
    <StorySection title="Stack">
      <StoryParagraph>
        <Type>
          Stack arranges children components along a single axis. It provides simple parameters to
          configure the children alignment, spacing, dividing, and size allocation.
        </Type>
        <Type>
          The size allocation of the children can be configured by applying the <Code>t.flex</Code>
          {" "}
          token or the <Code>{"sx={{ flex: \"...\" }}"}</Code>{" "}
          sprinkle onto the child. There are three tokens to control children size allocation: grow,
          shrink, and static.
        </Type>
      </StoryParagraph>
    </StorySection>
    <PropsTable
      // dprint-ignore
      args={[
        { name: "axis", type: '"x" | "y"', default: null, description: "Stack direction/axis: horizontal or vertical.", required: true },
        { name: "x", type: '"left" | "center" | "right" | "space" | "stretch"', default: null, description: "How to align elements from left to right.", },
        { name: "y", type: '"top" | "center" | "bottom" | "space" | "stretch"', default: null, description: "How to align elements from top to bottom.", },
        { name: "gap", typePlain: "Space Token", default: null, description: "Add space between each child element.", },
        { name: "divider", typePlain: "Border Color Token", default: null, description: "Add a divider of the specified color between children.", },
        { name: "wrap", typePlain: "boolean", default: "false", description: "Wrap children onto multiple rows/columns.", },
        propDocChildren,
        propDocSX,
        propDocAs,
        propDocClassName,
        propDocStyle,
        propDocID,
      ]}
    />
    <StorySection title="Variants">
      <VariantsGallery columns={4} subtitle="X-Axis Stack">
        <Type />
        <Variant label="y" value="top" />
        <Variant label="y" value="center" />
        <Variant label="y" value="bottom" />

        <Variant label="x" value="left" />
        <ExampleStack axis="x" x="left" y="top" />
        <ExampleStack axis="x" x="left" y="center" />
        <ExampleStack axis="x" x="left" y="bottom" />

        <Variant label="x" value="center" />
        <ExampleStack axis="x" x="center" y="top" />
        <ExampleStack axis="x" x="center" y="center" />
        <ExampleStack axis="x" x="center" y="bottom" />

        <Variant label="x" value="right" />
        <ExampleStack axis="x" x="right" y="top" />
        <ExampleStack axis="x" x="right" y="center" />
        <ExampleStack axis="x" x="right" y="bottom" />

        <Variant label="x" value="space" />
        <ExampleStack axis="x" x="space" y="top" />
        <ExampleStack axis="x" x="space" y="center" />
        <ExampleStack axis="x" x="space" y="bottom" />
      </VariantsGallery>
      <VariantsGallery columns={5} subtitle="Y-Axis Stack">
        <Type />
        <Variant label="y" value="top" />
        <Variant label="y" value="center" />
        <Variant label="y" value="bottom" />
        <Variant label="y" value="space" />

        <Variant label="x" value="left" />
        <ExampleStack axis="y" x="left" y="top" />
        <ExampleStack axis="y" x="left" y="center" />
        <ExampleStack axis="y" x="left" y="bottom" />
        <ExampleStack axis="y" x="left" y="space" />

        <Variant label="x" value="center" />
        <ExampleStack axis="y" x="center" y="top" />
        <ExampleStack axis="y" x="center" y="center" />
        <ExampleStack axis="y" x="center" y="bottom" />
        <ExampleStack axis="y" x="center" y="space" />

        <Variant label="x" value="right" />
        <ExampleStack axis="y" x="right" y="top" />
        <ExampleStack axis="y" x="right" y="center" />
        <ExampleStack axis="y" x="right" y="bottom" />
        <ExampleStack axis="y" x="right" y="space" />
      </VariantsGallery>
      <VariantsGallery columns={3} subtitle="Other Variants">
        <Type />
        <Variant label="axis" value="x" />
        <Variant label="axis" value="y" />

        <Variant label="gap" value="4" />
        <ExampleStack axis="x" gap="4" sx={{ h: "64" }} />
        <ExampleStack axis="y" gap="4" sx={{ w: "64" }} />

        <VariantGroup>
          <Variant label="gap" value="4" />
          <Variant label="divider" value="neutral.default" />
        </VariantGroup>
        <ExampleStack axis="x" divider="neutral.default" gap="4" sx={{ h: "64" }} />
        <ExampleStack axis="y" divider="neutral.default" gap="4" sx={{ w: "64" }} />

        <VariantGroup>
          <Variant label="gap" value="4" />
          <Variant label="wrap" value="true" />
        </VariantGroup>
        <ExampleStack wrap axis="x" gap="4" sx={{ w: "64", h: "128" }} />
        <ExampleStack wrap axis="y" gap="4" sx={{ h: "64", w: "128" }} />
      </VariantsGallery>
    </StorySection>
    <StorySection title="Examples">
      <StorySection subsubtitle="Flex Childs">
        <Stack
          axis="x"
          gap="4"
          style={{ border: t.fn.border("1", "neutral.default") }}
          sx={{ w: "216", h: "96", p: "4" }}
        >
          <StackItem a="x" sx={{ w: "56", flex: "grow" }}>grow</StackItem>
          <StackItem a="x" sx={{ w: "56", flex: "shrink" }}>shrink</StackItem>
          <StackItem a="x" sx={{ w: "56", flex: "static" }}>static</StackItem>
        </Stack>
      </StorySection>
    </StorySection>
  </DocumentationStory>
);

type ExampleStackProps = Pick<StackProps, "axis" | "x" | "y" | "divider" | "wrap" | "gap" | "sx">;

const ExampleStack: FC<ExampleStackProps> = props => (
  <Stack
    {...props}
    style={{ border: t.fn.border("1", "neutral.default") }}
    sx={{ w: "96", h: "96", p: "4", ...props.sx }}
  >
    <StackItem a={props.axis}>1</StackItem>
    <StackItem a={props.axis}>2</StackItem>
    <StackItem a={props.axis}>3</StackItem>
  </Stack>
);

const StackItem: FC<{ children: ReactNode; sx?: SX; a: "x" | "y" }> = props => (
  <Center
    sx={{
      w: props.a === "x" ? "20" : "56",
      h: props.a === "y" ? "20" : "56",
      background: "brand.default",
      color: "brand.tint",
      ...props.sx,
    }}
  >
    {props.children}
  </Center>
);
