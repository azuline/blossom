import { DocumentationStory } from "@foundation/stories/components/DocumentationStory";
import {
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
import { Flex } from "@foundation/ui/Flex";
import { Type } from "@foundation/ui/Type";
import { View } from "@foundation/ui/View";
import { Redirect } from ".";

export default {
  title: "Primitives",
};

export const Redirect_: React.FC = () => (
  <DocumentationStory>
    <StorySection title="Redirect">
      <StoryParagraph>
        <Type>
          The Redirect component turns the child element into a link without affecting the child
          element&apos;s styles. This primitive should be used to create accessible custom elements
          that redirect to another page.
        </Type>
        <Type>
          By default, the Redirect is display inline.
        </Type>
        <Type>
          The <Code>Link</Code> component uses this component internally.
        </Type>
      </StoryParagraph>
    </StorySection>
    <PropsTable
      // dprint-ignore
      args={[
        { name: "href", type: "string", default: null, description: "The redirect destination.", required: true },
        { name: "open", type: "\"here\" | \"new-tab\"", default: '"here"', description: "Open in current tab or new tab.",  },
        propDocChildren,
        propDocSX,
        propDocClassName,
        propDocID,
        propDocStyle,
      ]}
    />
    <StorySection title="Examples">
      <Flex sx={{ direction: "column", gap: "16", align: "start" }}>
        <Redirect href="/">
          Take me home
        </Redirect>
        <Redirect href="/">
          <View
            sx={{
              background: "neutral.raised",
              bcol: "neutral.weak",
              bwidth: "1",
              p: "12",
              radius: "4",
              shadow: "raise.sm",
            }}
          >
            Take me home
          </View>
        </Redirect>
      </Flex>
    </StorySection>
  </DocumentationStory>
);
