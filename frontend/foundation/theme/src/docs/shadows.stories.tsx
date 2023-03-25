import { DocumentationStory } from "@foundation/stories/components/DocumentationStory";
import { StoryParagraph } from "@foundation/stories/components/StoryParagraph";
import { StorySection } from "@foundation/stories/components/StorySection";
import { Variant } from "@foundation/stories/components/Variant";
import { VariantsGallery } from "@foundation/stories/components/VariantsGallery";
import { Type } from "@foundation/ui";
import { View } from "@foundation/ui";

export default {
  title: "Theme",
};

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
