import { DocumentationStory } from "@foundation/stories/components/DocumentationStory";
import {
  propDocChildren,
  propDocClassName,
  propDocID,
  propDocStyle,
  propDocSX,
  PropsTable,
} from "@foundation/stories/components/PropsTable";
import { StoryParagraph } from "@foundation/stories/components/StoryParagraph";
import { StorySection } from "@foundation/stories/components/StorySection";
import { t } from "@foundation/theme/styles";
import { Bleed } from "@foundation/ui";
import { Card } from "@foundation/ui";
import { Center } from "@foundation/ui";
import { Stack } from "@foundation/ui";
import { Type } from "@foundation/ui";
import { View } from "@foundation/ui";
import { ReactNode } from "react";

export default {
  title: "Layout",
};

export const Bleed_: React.FC = () => (
  <DocumentationStory>
    <StorySection title="Bleed">
      <StoryParagraph>
        <Type>Bleed grows the child element beyond the size of its parent.</Type>
      </StoryParagraph>
    </StorySection>
    <PropsTable
      // dprint-ignore
      args={[
        { name: "m", typePlain: "Space Token", default: null, description: "Space to bleed on all sides." },
        { name: "my", typePlain: "Space Token", default: null, description: "Space to bleed on y-axis." },
        { name: "mx", typePlain: "Space Token", default: null, description: "Space to bleed on x-axis." },
        { name: "mt", typePlain: "Space Token", default: null, description: "Space to bleed on top side." },
        { name: "mr", typePlain: "Space Token", default: null, description: "Space to bleed on right side." },
        { name: "mb", typePlain: "Space Token", default: null, description: "Space to bleed on bottom side." },
        { name: "ml", typePlain: "Space Token", default: null, description: "Space to bleed on left side." },
        { name: "vars", type: "{ t?: string; r?: string; b?: string; l?: string }", default: null, description: "Raw untokenized CSS values to bleed on." },
        propDocChildren,
        propDocSX,
        propDocClassName,
        propDocID,
        propDocStyle,
      ]}
    />
    <StorySection title="Examples">
      <Stack wrap axis="x" gap="44" sx={{ pt: "20" }}>
        <CardWrapper>
          <Bleed m="28">
            <Content>m=28</Content>
          </Bleed>
        </CardWrapper>
        <CardWrapper>
          <Bleed my="28">
            <Content>my=28</Content>
          </Bleed>
        </CardWrapper>
        <CardWrapper>
          <Bleed mx="28">
            <Content>mx=28</Content>
          </Bleed>
        </CardWrapper>
        <CardWrapper>
          <Bleed mt="28">
            <Content>mt=28</Content>
          </Bleed>
        </CardWrapper>
        <CardWrapper>
          <Bleed mr="28">
            <Content>mr=28</Content>
          </Bleed>
        </CardWrapper>
        <CardWrapper>
          <Bleed mb="28">
            <Content>mb=28</Content>
          </Bleed>
        </CardWrapper>
        <CardWrapper>
          <Bleed ml="28">
            <Content>ml=28</Content>
          </Bleed>
        </CardWrapper>
      </Stack>
    </StorySection>
  </DocumentationStory>
);

type CardWrapperProps = { children: ReactNode };

const CardWrapper: React.FC<CardWrapperProps> = props => (
  <Card sx={{ w: "128", h: "128" }}>
    {props.children}
  </Card>
);

type ContentProps = { children: ReactNode };

const Content: React.FC<ContentProps> = props => (
  <View
    style={{ border: t.fn.border("1", "brand.default") }}
    sx={{ w: "full", h: "full", radius: "2" }}
  >
    <Center>
      <Type>{props.children}</Type>
    </Center>
  </View>
);
