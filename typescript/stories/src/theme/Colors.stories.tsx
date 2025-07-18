import { moonlightPalette, t } from "@foundation/theme";
import { Stack, Type, View } from "@foundation/ui";
import { FC } from "react";
import { DocumentationStory } from "../lib/DocumentationStory";
import { StoryParagraph } from "../lib/StoryParagraph";
import { StorySection } from "../lib/StorySection";

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
    <Stack axis="y" gap="28">
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
    </Stack>
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
    <Stack axis="y" gap="44">
      <StorySection axis="x" subtitle="Background" sx={{ gap: "36" }}>
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
      <StorySection axis="x" subtitle="Content" sx={{ gap: "36" }}>
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
      <StorySection axis="x" subtitle="Border" sx={{ gap: "36" }}>
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
    </Stack>
  </DocumentationStory>
);

type ColorPaletteProps = { palette: Record<string, string> };

const ColorPalette: FC<ColorPaletteProps> = props => (
  <Stack axis="x">
    {Object.entries(props.palette).map(([name, color]) => (
      <Stack key={name} axis="y" gap="16" x="center">
        <View style={{ background: color }} sx={{ h: "64", w: "96" }} />
        <Type sx={{ whiteSpace: "nowrap", textTransform: "capitalize" }}>{name}</Type>
      </Stack>
    ))}
  </Stack>
);
