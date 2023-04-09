import { Code, Type, View } from "@foundation/ui";
import { DocumentationStory } from "../lib/DocumentationStory";
import {
  propDocAs,
  propDocChildren,
  propDocClassName,
  propDocID,
  propDocStyle,
  propDocSX,
  PropsTable,
} from "../lib/PropsTable";
import { StoryParagraph } from "../lib/StoryParagraph";
import { StorySection } from "../lib/StorySection";

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
