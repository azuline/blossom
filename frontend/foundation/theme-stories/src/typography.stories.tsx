import { DocumentationStory, StoryParagraph, StorySection } from "@foundation/stories";
import { Code, Divider, Stack, Type } from "@foundation/ui";

export default {
  title: "Theme",
};

export const Typography: React.FC = () => (
  <DocumentationStory>
    <StorySection title="Typography">
      <StoryParagraph>
        <Type>
          We have three typefaces: a display font, a body font, and a code font.
        </Type>
        <Type>
          Use the <Code>Type</Code> atom component to create text elements.
        </Type>
      </StoryParagraph>
    </StorySection>
    <StorySection title="Display">
      <StoryParagraph>
        <Type>
          Display type is intended to be used for headings and titles. It stands out from the body
          text. Avoid using display type for body text.
        </Type>
        <Type>
          Our display typeface is <Type italic>EB Garamond</Type>.
        </Type>
      </StoryParagraph>
      <Divider color="neutral.weak" />
      <Stack axis="y" gap="20">
        <Type sx={{ whiteSpace: "nowrap" }} variant="disp-xxxl">Display / XXXL</Type>
        <Type sx={{ whiteSpace: "nowrap" }} variant="disp-xxl">Display / XXL</Type>
        <Type sx={{ whiteSpace: "nowrap" }} variant="disp-xl">Display / XL</Type>
        <Type sx={{ whiteSpace: "nowrap" }} variant="disp-lg">Display / LG</Type>
        <Type sx={{ whiteSpace: "nowrap" }} variant="disp-md">Display / MD</Type>
        <Type sx={{ whiteSpace: "nowrap" }} variant="disp-sm">Display / SM</Type>
      </Stack>
    </StorySection>
    <StorySection title="Body">
      <StoryParagraph>
        <Type>
          Body type is intended to be used for general content. Default to this type.
        </Type>
        <Type>
          Our body typeface is <Type italic>Alegreya Sans</Type>.
        </Type>
      </StoryParagraph>
      <Divider color="neutral.weak" />
      <Stack axis="y" gap="20">
        <Type sx={{ whiteSpace: "nowrap" }} variant="lg">Body / LG</Type>
        <Type sx={{ whiteSpace: "nowrap" }} variant="md">Body / MD</Type>
        <Type sx={{ whiteSpace: "nowrap" }} variant="sm">Body / SM</Type>
        <Type sx={{ whiteSpace: "nowrap" }} variant="xs">Body / XS</Type>
      </Stack>
    </StorySection>
    <StorySection title="Code">
      <StoryParagraph>
        <Type>
          Code type is intended to be used for code snippets.
        </Type>
        <Type>
          Our code typeface is <Type italic>Source Code Pro</Type>.
        </Type>
      </StoryParagraph>
      <Divider color="neutral.weak" />
      <Stack axis="y" gap="20">
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
      </Stack>
    </StorySection>
  </DocumentationStory>
);
