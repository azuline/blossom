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
        The Primitive Color Palette defines the colors used in the application and lightness scales
        for each of them. These are not consumed directly by the Design System or Application. The
        Semantic Color Theme builds on top of the color scales by defining semantic intents with
        associated colors taken from the primitive palette.
      </StoryParagraph>
      <StoryParagraph>
        The light and dark themes share the same set of primitive colors.
      </StoryParagraph>
    </StorySection>
    <StorySection title="Tokens">
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
    </StorySection>
  </DocumentationStory>
);

export const ColorSemantic: React.FC = () => (
  <DocumentationStory>
    <StorySection title="Semantic Color Theme">
      <StoryParagraph>
        The Semantic Color Theme theme defines a set of <Type italic>semantic intents</Type>{" "}
        that map to how we use color. Each theme binds a set of colors to the semantic intents.
      </StoryParagraph>
      <StoryParagraph>
        This decouples our UI from the specific colors in use, allowing for painless multi-theme
        support and color system changes across the entire system and application.
      </StoryParagraph>
    </StorySection>
    <StorySection sx={{ gap: "44" }} title="Tokens">
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
    </StorySection>
  </DocumentationStory>
);

export const Typography: React.FC = () => (
  <DocumentationStory>
    <StorySection title="Typography">
      <StoryParagraph>
        We use three typefaces: Cormorant Garamond, Alegreya Sans, and Source Code Pro. These are,
        respectively, our display font, body font, and monospaced code font.
      </StoryParagraph>
      <StoryParagraph>
        The typography scale has four kinds of type: Display, Label, Paragraph, and Code. Display is
        intended for titles and branding, Label for single-line application labels, Paragraph for
        multi-line body text, and Code for code.
      </StoryParagraph>
    </StorySection>
    <StorySection title="Display">
      <StoryParagraph>
        Display type is intended to be used for headings and titles. It stands out from the body
        text. Avoid using display type for body text, as it has a low x-height.
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
    <StorySection title="Label">
      <StoryParagraph>
        Label type is intended to be used for short single-line labels in the application. This
        type&apos;s line height is the same as its font size, which makes precise alignment with
        other elements easier. However, this hurts the text&apos;s readability over multiple lines.
      </StoryParagraph>
      <Divider color="neutral.weak" />
      <Flex sx={{ direction: "column", gap: "20" }}>
        <Type sx={{ whiteSpace: "nowrap" }} variant="lg">Label / LG</Type>
        <Type sx={{ whiteSpace: "nowrap" }} variant="md">Label / MD</Type>
        <Type sx={{ whiteSpace: "nowrap" }} variant="sm">Label / SM</Type>
        <Type sx={{ whiteSpace: "nowrap" }} variant="xs">Label / XS</Type>
      </Flex>
    </StorySection>
    <StorySection title="Paragraph">
      <StoryParagraph>
        Paragraph type is intended to be used for multi-line body text in the application. This type
        has a comfortable line height for better readability; however, this line height makes this
        type hard to precisely align with UI elements.
      </StoryParagraph>
      <Divider color="neutral.weak" />
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
    </StorySection>
    <StorySection title="Code">
      <StoryParagraph>
        Code type is TODO...
      </StoryParagraph>
      <Divider color="neutral.weak" />
      <Flex sx={{ direction: "column", gap: "20" }}>
        <Type sx={{ whiteSpace: "nowrap" }} variant="md">
          Soon~
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
        We use shadows to create subtle visual cues for lighting and naturalness. We do
        not rely on shadows for hierarchy. Therefore, the shadow tokens are arranged
        around element size instead of visual hierarchy.
      </StoryParagraph>
      <StoryParagraph>
        The shadow tokens are each composed of several inner shadows and drop shadows.
        There are two sets of shadow tokens: one designed to match raised surfaces and
        the other inset surfaces.
      </StoryParagraph>
      <StoryParagraph>
        The raised shadows contain: (1) a thin dark outer shadow wrapper to &ldquo;cut
        out&rdquo; the element from the background, (2) several drop shadows to mimic
        shadows, and (3) inner lightings to mimic ambient and source lights.
      </StoryParagraph>
      <StoryParagraph>
        The innset tokens contain: (1) A top shadow and (2) bottom lighting to mimic
        light shining on an inset element.
      </StoryParagraph>
    </StorySection>
    <VariantsGallery columns={7} title="Tokens">
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
