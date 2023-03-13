import { DocumentationStory } from "@foundation/stories/DocumentationStory";
import { StoryParagraph } from "@foundation/stories/StoryParagraph";
import { StorySection } from "@foundation/stories/StorySection";
import { Variant } from "@foundation/stories/Variant";
import { VariantsGallery } from "@foundation/stories/VariantsGallery";
import { Card } from "@foundation/ui/Card";
import { Center } from "@foundation/ui/Center";
import { Divider } from "@foundation/ui/Divider";
import { Flex } from "@foundation/ui/Flex";
import { Type } from "@foundation/ui/Type";
import { View } from "@foundation/ui/View";
import { FC, ReactNode } from "react";

export default {
  title: "Layout",
};

export const Divider_: React.FC = () => (
  <DocumentationStory>
    <StorySection title="Divider">
      <StoryParagraph>
        A divider visually separates disjoint content with a dividing line and margin space.
      </StoryParagraph>
      <StoryParagraph>
        The props configure the divider&apos;s size, orientation, color, and amount of margin.
      </StoryParagraph>
    </StorySection>
    <VariantsGallery columns={3}>
      <Type />
      <Variant label="orientation" value="horizontal" />
      <Variant label="orientation" value="vertical" />

      <Variant label="size" value="1" />
      <DividerContainer>
        <Divider orientation="horizontal" size="1" />
      </DividerContainer>
      <DividerContainer>
        <Divider orientation="vertical" size="1" />
      </DividerContainer>

      <Variant label="size" value="2" />
      <DividerContainer>
        <Divider orientation="horizontal" size="2" />
      </DividerContainer>
      <DividerContainer>
        <Divider orientation="vertical" size="2" />
      </DividerContainer>
    </VariantsGallery>
    <StorySection title="Examples">
      <StorySection subtitle="Horizontal">
        <Card sx={{ w: "128" }}>
          <Flex sx={{ direction: "column" }}>
            <View sx={{ h: "28", w: "full", background: "brand.default" }} />
            <Divider my="16" />
            <View sx={{ h: "28", w: "full", background: "brand.default" }} />
            <Divider my="16" />
            <View sx={{ h: "28", w: "full", background: "brand.default" }} />
          </Flex>
        </Card>
      </StorySection>
      <StorySection subtitle="Vertical">
        <Card sx={{ h: "96", w: "216" }}>
          <Flex sx={{ h: "full" }}>
            <View sx={{ h: "full", w: "44", background: "brand.default" }} />
            <Divider mx="16" orientation="vertical" />
            <View sx={{ h: "full", w: "44", background: "brand.default" }} />
            <Divider mx="16" orientation="vertical" />
            <View sx={{ h: "full", w: "44", background: "brand.default" }} />
          </Flex>
        </Card>
      </StorySection>
    </StorySection>
  </DocumentationStory>
);

const DividerContainer: FC<{ children: ReactNode }> = props => (
  <View sx={{ h: "64", w: "64" }}>
    <Center>{props.children}</Center>
  </View>
);
