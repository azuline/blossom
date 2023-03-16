import { DocumentationStory } from "@foundation/stories/components/DocumentationStory";
import { StoryParagraph } from "@foundation/stories/components/StoryParagraph";
import { StorySection } from "@foundation/stories/components/StorySection";
import { CodeBlock } from "@foundation/ui/CodeBlock";
import { Type } from "@foundation/ui/Type";

export default {
  title: "Primitives",
};

export const VisuallyHidden_: React.FC = () => (
  <DocumentationStory>
    <StorySection title="VisuallyHidden">
      <StoryParagraph>
        <Type>
          VisuallyHidden renders an element yet hides it from the screen. Screen readers will still
          pick up the element.
        </Type>
        <Type>
          VisuallyHidden is primarily used for accessibility. VisuallyHidden can also be used to
          eager-load lazy-loaded elements by rendering the lazy-loaded element inside
          VisuallyHidden.
        </Type>
        <Type>Example:</Type>
        <CodeBlock code="<VisuallyHidden>Something</VisuallyHidden>" />
      </StoryParagraph>
    </StorySection>
  </DocumentationStory>
);
