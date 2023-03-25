import { DocumentationStory } from "@foundation/stories";
import {
  propDocChildren,
  propDocClassName,
  propDocID,
  propDocStyle,
  propDocSX,
  PropsTable,
} from "@foundation/stories";
import { StoryParagraph } from "@foundation/stories";
import { StorySection } from "@foundation/stories";
import { Code } from "@foundation/ui";
import { Stack } from "@foundation/ui";
import { Type } from "@foundation/ui";
import { View } from "@foundation/ui";
import { Touchable } from ".";

export default {
  title: "Primitives",
};

// eslint-disable-next-line no-alert
const alertOnPress = (): void => alert("u pressed me");

export const Touchable_: React.FC = () => (
  <DocumentationStory>
    <StorySection title="Touchable">
      <StoryParagraph>
        <Type>
          The Touchable component turns the child element into a semantic button without affecting
          the child element&apos;s styles. This primitive should be used to create accessible custom
          clickable elements.
        </Type>
        <Type>
          The <Code>Button</Code> component uses this component internally.
        </Type>
      </StoryParagraph>
    </StorySection>
    <PropsTable
      // dprint-ignore
      args={[
        { name: "onPress", typePlain: "Callback", default: null, description: "Callback on press." },
        { name: "disabled", type: "boolean", default: "false", description: "Disable pressing." },
        { name: "type", type: '"button" | "submit" | "reset"', default: "button", description: "Semantic type of button." },
        propDocChildren,
        propDocSX,
        propDocClassName,
        propDocID,
        propDocStyle,
      ]}
    />
    <StorySection title="Examples">
      <Stack axis="y" gap="16" x="left">
        <Touchable onPress={alertOnPress}>
          Touch me
        </Touchable>
        <Touchable onPress={alertOnPress}>
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
            Touch me
          </View>
        </Touchable>
      </Stack>
    </StorySection>
  </DocumentationStory>
);
