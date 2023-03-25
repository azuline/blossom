import {
  DocumentationStory,
  StoryParagraph,
  StorySection,
  Variant,
  VariantsGallery,
} from "@foundation/stories";
import { Card, Center, Divider, Stack, Type, View } from "@foundation/ui";
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
    <StorySection axis="x" title="Examples">
      <StorySection subtitle="Horizontal">
        <Card sx={{ w: "128" }}>
          <Stack axis="y">
            <View sx={{ h: "28", w: "full", background: "brand.default" }} />
            <Divider my="16" />
            <View sx={{ h: "28", w: "full", background: "brand.default" }} />
            <Divider my="16" />
            <View sx={{ h: "28", w: "full", background: "brand.default" }} />
          </Stack>
        </Card>
      </StorySection>
      <StorySection subtitle="Vertical">
        <Card sx={{ h: "96", w: "216" }}>
          <Stack axis="x" sx={{ h: "full" }}>
            <View sx={{ h: "full", w: "44", background: "brand.default" }} />
            <Divider mx="16" orientation="vertical" />
            <View sx={{ h: "full", w: "44", background: "brand.default" }} />
            <Divider mx="16" orientation="vertical" />
            <View sx={{ h: "full", w: "44", background: "brand.default" }} />
          </Stack>
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
