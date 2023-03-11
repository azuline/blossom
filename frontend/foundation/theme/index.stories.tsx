import { ColorPalette } from "@foundation/stories/ColorPalette";
import { DocumentationStory } from "@foundation/stories/DocumentationStory";
import { StoryParagraph } from "@foundation/stories/StoryParagraph";
import { StorySection } from "@foundation/stories/StorySection";
import { moonlightPalette } from "@foundation/theme/codegen/moonlight.css";
import { t } from "@foundation/theme/styles";
import { Flex } from "@foundation/ui/Flex";
import { Type } from "@foundation/ui/Type";

export default {
  title: "Theme",
};

export const Palette: React.FC = () => (
  <DocumentationStory>
    <StorySection title="Palette">
      <StoryParagraph>
        The color palette defines the set of visual colors and steps for the themes. The light and
        dark themes select from this palette to create their semantic palettes.
      </StoryParagraph>
    </StorySection>
    <StorySection subtitle="Neutral">
      <ColorPalette palette={moonlightPalette.neutral} />
    </StorySection>
    <StorySection subtitle="Brand">
      <ColorPalette palette={moonlightPalette.brand} />
    </StorySection>
    <StorySection subtitle="Red">
      <ColorPalette palette={moonlightPalette.red} />
    </StorySection>
    <StorySection subtitle="Orange">
      <ColorPalette palette={moonlightPalette.orange} />
    </StorySection>
    <StorySection subtitle="Green">
      <ColorPalette palette={moonlightPalette.green} />
    </StorySection>
    <StorySection subtitle="Overlay">
      <ColorPalette palette={moonlightPalette.overlay} />
    </StorySection>
  </DocumentationStory>
);

export const Theme: React.FC = () => (
  <DocumentationStory gap="80">
    <StorySection title="Theme">
      <StoryParagraph>
        The theme defines a semantic palette based on the base color palette. This semantic palette
        arranges colors based on intent in usage.
      </StoryParagraph>
    </StorySection>
    <StorySection title="Background">
      <Flex sx={{ gap: "28", maxw: "1440", wrap: "wrap" }}>
        <StorySection subtitle="Neutral">
          <ColorPalette palette={t.color.background.neutral} />
        </StorySection>
        <StorySection subtitle="Inverse">
          <ColorPalette palette={t.color.background.inverse} />
        </StorySection>
        <StorySection subtitle="Overlay">
          <ColorPalette palette={t.color.background.overlay} />
        </StorySection>
        <StorySection subtitle="Brand">
          <ColorPalette palette={t.color.background.brand} />
        </StorySection>
        <StorySection subtitle="Positive">
          <ColorPalette palette={t.color.background.positive} />
        </StorySection>
        <StorySection subtitle="Caution">
          <ColorPalette palette={t.color.background.caution} />
        </StorySection>
        <StorySection subtitle="Negative">
          <ColorPalette palette={t.color.background.negative} />
        </StorySection>
        <StorySection subtitle="Decoration">
          <ColorPalette palette={t.color.background.decoration} />
        </StorySection>
      </Flex>
    </StorySection>
    <StorySection title="Content">
      <Flex sx={{ gap: "28", maxw: "1440", wrap: "wrap" }}>
        <StorySection subtitle="Neutral">
          <ColorPalette palette={t.color.content.neutral} />
        </StorySection>
        <StorySection subtitle="Inverse">
          <ColorPalette palette={t.color.content.inverse} />
        </StorySection>
        <StorySection subtitle="Brand">
          <ColorPalette palette={t.color.content.brand} />
        </StorySection>
        <StorySection subtitle="Positive">
          <ColorPalette palette={t.color.content.positive} />
        </StorySection>
        <StorySection subtitle="Caution">
          <ColorPalette palette={t.color.content.caution} />
        </StorySection>
        <StorySection subtitle="Negative">
          <ColorPalette palette={t.color.content.negative} />
        </StorySection>
      </Flex>
    </StorySection>
    <StorySection title="Border">
      <Flex sx={{ gap: "28", maxw: "1440", wrap: "wrap" }}>
        <StorySection subtitle="Neutral">
          <ColorPalette palette={t.color.border.neutral} />
        </StorySection>
        <StorySection subtitle="Inverse">
          <ColorPalette palette={t.color.border.inverse} />
        </StorySection>
        <StorySection subtitle="Negative">
          <ColorPalette palette={t.color.border.negative} />
        </StorySection>
      </Flex>
    </StorySection>
  </DocumentationStory>
);

export const Typography: React.FC = () => (
  <DocumentationStory>
    <StorySection title="Introduction">
      <StoryParagraph>
        The typography scale has three kinds of type: Display, Label, and Paragraph. Display is
        intended for titles and branding, Label for single-line application labels, and Paragraph
        for multi-line body text.
      </StoryParagraph>
    </StorySection>
    <Flex sx={{ gap: "80", wrap: "wrap" }}>
      <Flex sx={{ direction: "column", gap: "20" }}>
        <Type sx={{ whiteSpace: "nowrap" }} variant="disp-xxl">Display / XXL</Type>
        <Type sx={{ whiteSpace: "nowrap" }} variant="disp-xl">Display / XL</Type>
        <Type sx={{ whiteSpace: "nowrap" }} variant="disp-lg">Display / LG</Type>
        <Type sx={{ whiteSpace: "nowrap" }} variant="disp-md">Display / MD</Type>
        <Type sx={{ whiteSpace: "nowrap" }} variant="disp-sm">Display / SM</Type>
      </Flex>
      <Flex sx={{ direction: "column", gap: "20" }}>
        <Type sx={{ whiteSpace: "nowrap" }} variant="lg">Label / LG</Type>
        <Type sx={{ whiteSpace: "nowrap" }} variant="md">Label / MD</Type>
        <Type sx={{ whiteSpace: "nowrap" }} variant="sm">Label / SM</Type>
        <Type sx={{ whiteSpace: "nowrap" }} variant="xs">Label / XS</Type>
      </Flex>
      <Flex sx={{ direction: "column", gap: "20" }}>
        <Type paragraph sx={{ whiteSpace: "nowrap" }} variant="lg">
          Paragraph / LG<br />Paragraph / LG
        </Type>
        <Type paragraph sx={{ whiteSpace: "nowrap" }} variant="md">
          Paragraph / MD<br />Paragraph / MD
        </Type>
        <Type paragraph sx={{ whiteSpace: "nowrap" }} variant="sm">
          Paragraph / SM<br />Paragraph / SM
        </Type>
        <Type paragraph sx={{ whiteSpace: "nowrap" }} variant="xs">
          Paragraph / XS<br />Paragraph / XS
        </Type>
      </Flex>
    </Flex>
  </DocumentationStory>
);
