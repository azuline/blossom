import { DocumentationStory } from "@foundation/stories/DocumentationStory";
import { StoryParagraph } from "@foundation/stories/StoryParagraph";
import { StorySection } from "@foundation/stories/StorySection";
import { Variant } from "@foundation/stories/Variant";
import { VariantsGallery } from "@foundation/stories/VariantsGallery";
import { moonlightPalette } from "@foundation/theme/codegen/moonlight.css";
import { t } from "@foundation/theme/styles";
import { Flex } from "@foundation/ui/Flex";
import { Type } from "@foundation/ui/Type";
import { View } from "@foundation/ui/View";
import { FC } from "react";

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

// dprint-ignore
export const Elevation: React.FC = () => (
  <DocumentationStory>
    <StorySection title="Elevation">
      <StoryParagraph>
        The elevation scale is still rudimentary. We primarily leverage elevation to create subtle
        visual cues for lighting and naturalness. We do not rely on elevation for hierarchy.
        Therefore, the elevation tokens are arranged around element size instead of visual
        hierarchy.
      </StoryParagraph>
      <StoryParagraph>
        The elevation tokens are composed of a set of box shadows. There are two main types of
        elevation tokens: Raised and Inset.
      </StoryParagraph>
      <StoryParagraph>
        Raised tokens contain: (1) a thin dark outer shadow wrapper to &ldquo;cut out&rdquo; the
        element from the background, (2) several drop shadows to mimic shadows, and (3) inner
        lighting to mimic ambient and source lights.
      </StoryParagraph>
      <StoryParagraph>
        Inset tokens contain: (1) A top shadow and (2) bottom lighting to mimic light shining on an
        inset element.
      </StoryParagraph>
    </StorySection>
    <VariantsGallery columns={7}>
      <Type />
      <Variant label="color" value="neutral.base" />
      <Variant label="color" value="neutral.raised" />
      <Variant label="color" value="brand.default" />
      <Variant label="color" value="positive.default" />
      <Variant label="color" value="caution.default" />
      <Variant label="color" value="negative.default" />

      <Variant label="shadow" value="none" />
      <View sx={{ w: "44", h: "44", background: "neutral.base", bwidth: "1", bcol: "neutral.weak" }} />
      <View sx={{ w: "44", h: "44", background: "neutral.raised", bwidth: "1", bcol: "neutral.weak" }} />
      <View sx={{ w: "44", h: "44", background: "brand.default" }} />
      <View sx={{ w: "44", h: "44", background: "positive.default" }} />
      <View sx={{ w: "44", h: "44", background: "caution.default" }} />
      <View sx={{ w: "44", h: "44", background: "negative.default" }} />

      <Variant label="shadow" value="raise.sm" />
      <View sx={{ w: "44", h: "44", background: "neutral.base", shadow: "raise.sm", bwidth: "1", bcol: "neutral.weak" }} />
      <View sx={{ w: "44", h: "44", background: "neutral.raised", shadow: "raise.sm", bwidth: "1", bcol: "neutral.weak" }} />
      <View sx={{ w: "44", h: "44", background: "brand.default", shadow: "raise.sm" }} />
      <View sx={{ w: "44", h: "44", background: "positive.default", shadow: "raise.sm" }} />
      <View sx={{ w: "44", h: "44", background: "caution.default", shadow: "raise.sm" }} />
      <View sx={{ w: "44", h: "44", background: "negative.default", shadow: "raise.sm" }} />

      <Variant label="shadow" value="raise.md" />
      <View sx={{ w: "64", h: "64", background: "neutral.base", shadow: "raise.md", bwidth: "1", bcol: "neutral.weak" }} />
      <View sx={{ w: "64", h: "64", background: "neutral.raised", shadow: "raise.md", bwidth: "1", bcol: "neutral.weak" }} />
      <View sx={{ w: "64", h: "64", background: "brand.default", shadow: "raise.md" }} />
      <View sx={{ w: "64", h: "64", background: "positive.default", shadow: "raise.md" }} />
      <View sx={{ w: "64", h: "64", background: "caution.default", shadow: "raise.md" }} />
      <View sx={{ w: "64", h: "64", background: "negative.default", shadow: "raise.md" }} />

      <Variant label="shadow" value="inset.sm" />
      <View sx={{ w: "44", h: "44", background: "neutral.base", shadow: "inset.sm", bwidth: "1", bcol: "neutral.weak" }} />
      <View sx={{ w: "44", h: "44", background: "neutral.raised", shadow: "inset.sm", bwidth: "1", bcol: "neutral.weak" }} />
      <View sx={{ w: "44", h: "44", background: "brand.default", shadow: "inset.sm" }} />
      <View sx={{ w: "44", h: "44", background: "positive.default", shadow: "inset.sm" }} />
      <View sx={{ w: "44", h: "44", background: "caution.default", shadow: "inset.sm" }} />
      <View sx={{ w: "44", h: "44", background: "negative.default", shadow: "inset.sm" }} />

      <Variant label="shadow" value="inset.md" />
      <View sx={{ w: "64", h: "64", background: "neutral.base", shadow: "inset.md", bwidth: "1", bcol: "neutral.weak" }} />
      <View sx={{ w: "64", h: "64", background: "neutral.raised", shadow: "inset.md", bwidth: "1", bcol: "neutral.weak" }} />
      <View sx={{ w: "64", h: "64", background: "brand.default", shadow: "inset.md" }} />
      <View sx={{ w: "64", h: "64", background: "positive.default", shadow: "inset.md" }} />
      <View sx={{ w: "64", h: "64", background: "caution.default", shadow: "inset.md" }} />
      <View sx={{ w: "64", h: "64", background: "negative.default", shadow: "inset.md" }} />
    </VariantsGallery>
  </DocumentationStory>
);

type ColorPaletteProps = { palette: Record<string, string> };

const ColorPalette: FC<ColorPaletteProps> = props => (
  <Flex>
    {Object.entries(props.palette).map(([name, color]) => (
      <Flex key={name} sx={{ direction: "column", gap: "16", align: "center" }}>
        <View style={{ background: color }} sx={{ h: "64", w: "96" }} />
        <Type sx={{ whiteSpace: "nowrap", textTransform: "capitalize" }}>{name}</Type>
      </Flex>
    ))}
  </Flex>
);
