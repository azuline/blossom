import { ColorPalette } from "@foundation/stories/ColorPalette";
import { DocumentationStory } from "@foundation/stories/DocumentationStory";
import { StoryParagraph } from "@foundation/stories/StoryParagraph";
import { StorySection } from "@foundation/stories/StorySection";
import { t } from "@foundation/style";
import { moonlightPalette } from "@foundation/style/themes/moonlight.css";
import { Flex } from "@foundation/ui/Flex";

export default {
  title: "Theme",
};

export const MoonlightPalette: React.FC = () => (
  <DocumentationStory>
    <StorySection title="Moonlight Palette">
      <StoryParagraph>
        The moonlight color palette defines the set of visual colors and steps for the moonlight
        themes. The light and dark themes select from this palette to create their semantic
        palettes.
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

export const MoonlightThemeLight: React.FC = () => (
  <DocumentationStory gap="80">
    <StorySection title="Moonlight Theme - Light">
      <StoryParagraph>
        The moonlight light theme defines a semantic palette based on the moonlight base color
        palette. This semantic palette arranges colors based on intent in usage.
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
