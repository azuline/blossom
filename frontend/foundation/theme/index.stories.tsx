import { DocumentationStory } from "@foundation/stories/DocumentationStory";
import { StoryParagraph } from "@foundation/stories/StoryParagraph";
import { StorySection } from "@foundation/stories/StorySection";
import { Variant } from "@foundation/stories/Variant";
import { VariantsGallery } from "@foundation/stories/VariantsGallery";
import { moonlightPalette } from "@foundation/theme/codegen/moonlight.css";
import { t } from "@foundation/theme/styles";
import { Divider } from "@foundation/ui/Divider";
import { Flex } from "@foundation/ui/Flex";
import { Type } from "@foundation/ui/Type";
import { View } from "@foundation/ui/View";
import { FC } from "react";

export default {
  title: "Theme",
};

export const ColorsPrimitive: React.FC = () => (
  <DocumentationStory>
    <StorySection title="Primitive Color Palette">
      <StoryParagraph>
        <Type>
          The Primitive Color Palette defines the colors used in the application and lightness
          scales for each of them. These are not consumed directly by the Design System or
          Application.
        </Type>
        <Type>
          The Semantic Color Theme builds on top of the color scales by defining semantic intents
          with associated colors taken from the primitive palette. Both the light and dark themes
          share this same primitive palette.
        </Type>
        <Type>
          Primitive colors are named with their lightness value. We chose this to make future
          changes to the scale easier. Adding and removing colors is an easy operation.
        </Type>
      </StoryParagraph>
    </StorySection>
    <Flex sx={{ direction: "column", gap: "28" }}>
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
    </Flex>
  </DocumentationStory>
);

export const ColorSemantic: React.FC = () => (
  <DocumentationStory>
    <StorySection title="Semantic Color Theme">
      <StoryParagraph>
        <Type>
          The Semantic Color Theme theme defines a set of <Type italic>semantic intents</Type>{" "}
          that map to how we use color. Each theme binds a set of colors to the semantic intents.
        </Type>
        <Type>
          This decouples our UI from the specific colors in use, allowing for painless multi-theme
          support and color system changes across the entire system and application.
        </Type>
      </StoryParagraph>
    </StorySection>
    <Flex sx={{ direction: "column", gap: "44" }}>
      <StorySection align="row" subtitle="Background" sx={{ gap: "36" }}>
        <StorySection subsubtitle="Neutral">
          <ColorPalette palette={t.color.background.neutral} />
        </StorySection>
        <StorySection subsubtitle="Inverse">
          <ColorPalette palette={t.color.background.inverse} />
        </StorySection>
        <StorySection subsubtitle="Overlay">
          <ColorPalette palette={t.color.background.overlay} />
        </StorySection>
        <StorySection subsubtitle="Brand">
          <ColorPalette palette={t.color.background.brand} />
        </StorySection>
        <StorySection subsubtitle="Positive">
          <ColorPalette palette={t.color.background.positive} />
        </StorySection>
        <StorySection subsubtitle="Caution">
          <ColorPalette palette={t.color.background.caution} />
        </StorySection>
        <StorySection subsubtitle="Negative">
          <ColorPalette palette={t.color.background.negative} />
        </StorySection>
        <StorySection subsubtitle="Decoration">
          <ColorPalette palette={t.color.background.decoration} />
        </StorySection>
      </StorySection>
      <StorySection align="row" subtitle="Content" sx={{ gap: "36" }}>
        <StorySection subsubtitle="Neutral">
          <ColorPalette palette={t.color.content.neutral} />
        </StorySection>
        <StorySection subsubtitle="Inverse">
          <ColorPalette palette={t.color.content.inverse} />
        </StorySection>
        <StorySection subsubtitle="Brand">
          <ColorPalette palette={t.color.content.brand} />
        </StorySection>
        <StorySection subsubtitle="Positive">
          <ColorPalette palette={t.color.content.positive} />
        </StorySection>
        <StorySection subsubtitle="Caution">
          <ColorPalette palette={t.color.content.caution} />
        </StorySection>
        <StorySection subsubtitle="Negative">
          <ColorPalette palette={t.color.content.negative} />
        </StorySection>
      </StorySection>
      <StorySection align="row" subtitle="Border" sx={{ gap: "36" }}>
        <StorySection subsubtitle="Neutral">
          <ColorPalette palette={t.color.border.neutral} />
        </StorySection>
        <StorySection subsubtitle="Inverse">
          <ColorPalette palette={t.color.border.inverse} />
        </StorySection>
        <StorySection subsubtitle="Negative">
          <ColorPalette palette={t.color.border.negative} />
        </StorySection>
      </StorySection>
    </Flex>
  </DocumentationStory>
);

export const Typography: React.FC = () => (
  <DocumentationStory>
    <StorySection title="Typography">
      <StoryParagraph>
        We have three typefaces: a display font, a body font, and a code font.
      </StoryParagraph>
    </StorySection>
    <StorySection title="Display">
      <StoryParagraph>
        <Type>
          Display type is intended to be used for headings and titles. It stands out from the body
          text. Avoid using display type for body text, as it has a low x-height.
        </Type>
        <Type>
          Our display typeface is <Type italic>Cormorant Garamond</Type>. TODO.
        </Type>
      </StoryParagraph>
      <Divider color="neutral.weak" />
      <Flex sx={{ direction: "column", gap: "20" }}>
        <Type sx={{ whiteSpace: "nowrap" }} variant="disp-xxl">Display / XXL</Type>
        <Type sx={{ whiteSpace: "nowrap" }} variant="disp-xl">Display / XL</Type>
        <Type sx={{ whiteSpace: "nowrap" }} variant="disp-lg">Display / LG</Type>
        <Type sx={{ whiteSpace: "nowrap" }} variant="disp-md">Display / MD</Type>
        <Type sx={{ whiteSpace: "nowrap" }} variant="disp-sm">Display / SM</Type>
      </Flex>
    </StorySection>
    <StorySection title="Body">
      <StoryParagraph>
        <Type>
          Body type is intended to be used for general content.
        </Type>
        <Type>
          Our body typeface is <Type italic>Alegreya Sans</Type>. TODO.
        </Type>
      </StoryParagraph>
      <Divider color="neutral.weak" />
      <Flex sx={{ direction: "column", gap: "20" }}>
        <Type sx={{ whiteSpace: "nowrap" }} variant="lg">Body / LG</Type>
        <Type sx={{ whiteSpace: "nowrap" }} variant="md">Body / MD</Type>
        <Type sx={{ whiteSpace: "nowrap" }} variant="sm">Body / SM</Type>
        <Type sx={{ whiteSpace: "nowrap" }} variant="xs">Body / XS</Type>
      </Flex>
    </StorySection>
    <StorySection title="Code">
      <StoryParagraph>
        <Type>
          Code type is intended to be used for code snippets.
        </Type>
        <Type>
          Our code typeface is <Type italic>Source Code Pro</Type>. TODO.
        </Type>
      </StoryParagraph>
      <Divider color="neutral.weak" />
      <Flex sx={{ direction: "column", gap: "20" }}>
        <Type sx={{ whiteSpace: "nowrap" }} variant="code-lg">
          Code / LG
        </Type>
        <Type sx={{ whiteSpace: "nowrap" }} variant="code-md">
          Code / MD
        </Type>
        <Type sx={{ whiteSpace: "nowrap" }} variant="code-sm">
          Code / SM
        </Type>
        <Type sx={{ whiteSpace: "nowrap" }} variant="code-xs">
          Code / XS
        </Type>
      </Flex>
    </StorySection>
  </DocumentationStory>
);

// dprint-ignore
export const Shadows: React.FC = () => (
  <DocumentationStory>
    <StorySection title="Shadows">
      <StoryParagraph>
        <Type>
          We use shadows to create subtle visual cues for lighting and naturalness. We do
          not rely on shadows for hierarchy. Therefore, the shadow tokens are arranged
          around element size instead of visual hierarchy.
        </Type>
        <Type>
          The shadow tokens are each composed of several inner shadows and drop shadows.
          There are two sets of shadow tokens: one designed to match raised surfaces and
          the other inset surfaces.
        </Type>
        <Type>
          The raised shadows contain: (1) a thin dark outer shadow wrapper to &ldquo;cut
          out&rdquo; the element from the background, (2) several drop shadows to mimic
          shadows, and (3) inner lightings to mimic ambient and source lights.
        </Type>
        <Type>
          The inset tokens contain: (1) A top shadow and (2) bottom lighting to mimic
          light shining on an inset element.
        </Type>
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
