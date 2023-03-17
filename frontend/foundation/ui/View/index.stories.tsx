import { DocumentationStory } from "@foundation/stories/components/DocumentationStory";
import {
  propDocAs,
  propDocChildren,
  propDocClassName,
  propDocID,
  propDocStyle,
  propDocSX,
  PropsTable,
} from "@foundation/stories/components/PropsTable";
import { StoryParagraph } from "@foundation/stories/components/StoryParagraph";
import { StorySection } from "@foundation/stories/components/StorySection";
import { Code } from "@foundation/ui/Code";
import { Type } from "@foundation/ui/Type";
import { View } from "@foundation/ui/View";

export default {
  title: "Primitives",
};

export const View_: React.FC = () => (
  <DocumentationStory>
    <StorySection title="View">
      <StoryParagraph>
        <Type>
          View is a primitive component that supports the common Design System props yet provides no
          styles of its own. Used as <Code>{"<View />"}</Code>, it renders a plain div.
        </Type>
      </StoryParagraph>
    </StorySection>
    <PropsTable
      // dprint-ignore
      args={[
        propDocChildren,
        propDocSX,
        propDocAs,
        propDocClassName,
        propDocStyle,
        propDocID,
      ]}
    />
    <StorySection title="Example">
      <View sx={{ bwidth: "1", maxw: "452", p: "36" }}>
        I&apos;m {"<View sx={{ bwidth: \"1\", maxw: \"452\", p: \"36\" }} />"}
      </View>
    </StorySection>
  </DocumentationStory>
);
