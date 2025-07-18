import { t } from "@foundation/theme";
import { Type, View } from "@foundation/ui";
import { FC, Fragment } from "react";
import { DocumentationStory } from "../lib/DocumentationStory";
import { StoryParagraph } from "../lib/StoryParagraph";
import { StorySection } from "../lib/StorySection";
import { sSizeScale } from "./Size.css";

export default {
  title: "Theme",
};

export const SizeAndSpace: React.FC = () => (
  <DocumentationStory>
    <StorySection title="Size">
      <StoryParagraph>
        <Type>
          The size tokens snap the size of content to a standard scale. Following the scale prevents
          similar-looking-yet-slightly-different sizes from appearing in the application and ensures
          that elements compose together nicely.
        </Type>
        <Type>
          The size tokens are of two kinds: pixels (which are raw numbers), percentages (which are
          fractions, plus full).
        </Type>
      </StoryParagraph>
    </StorySection>
    <StorySection subtitle="Size Scale">
      <SizeScale scale={t.size} />
    </StorySection>
    <StorySection title="Space">
      <StoryParagraph>
        <Type>
          The space tokens are a subset of the size tokens. They snap the space between elements to
          a standard scale.
        </Type>
      </StoryParagraph>
    </StorySection>
    <StorySection subtitle="Space Scale">
      <SizeScale scale={t.space} />
    </StorySection>
  </DocumentationStory>
);

type SizeScaleProps = {
  scale: Record<string, string>;
};

const SizeScale: FC<SizeScaleProps> = props => (
  <View className={sSizeScale}>
    {Object.entries(props.scale).map(([token, value]) => (
      <Fragment key={token}>
        <Type sx={{ color: "neutral.default" }}>{token}</Type>
        <View
          style={{ width: value }}
          sx={{ h: "16", background: "brand.default", radius: "circle" }}
        />
      </Fragment>
    ))}
  </View>
);
