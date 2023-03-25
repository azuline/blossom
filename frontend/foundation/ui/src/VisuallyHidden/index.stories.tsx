import { DocumentationStory } from "@foundation/stories/components/DocumentationStory";
import { propDocChildren, PropsTable } from "@foundation/stories/components/PropsTable";
import { StoryParagraph } from "@foundation/stories/components/StoryParagraph";
import { StorySection } from "@foundation/stories/components/StorySection";
import { CodeBlock } from "@foundation/ui";
import { Type } from "@foundation/ui";
import { VisuallyHidden } from "react-aria";

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
      </StoryParagraph>
    </StorySection>
    <PropsTable
      // dprint-ignore
      args={[
        propDocChildren,
      ]}
    />
    <StorySection title="Example">
      <CodeBlock code="<VisuallyHidden>Something</VisuallyHidden>" />
    </StorySection>
    <StorySection title="Test">
      <StorySection subsubtitle="Should Not Appear">
        <VisuallyHidden>hello</VisuallyHidden>
      </StorySection>
    </StorySection>
  </DocumentationStory>
);
