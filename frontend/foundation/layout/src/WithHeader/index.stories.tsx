import { DocumentationStory } from "@foundation/stories";
import { Card, View } from "@foundation/ui";
import { LayoutPaddingVariableSetter } from "../LayoutPaddingVariableSetter";
import { WithHeader } from ".";

export default {
  title: "Molecules",
};

export const Header_: React.FC = () => (
  <DocumentationStory>
    <Card padding="none" sx={{ w: "704", overflow: "hidden" }}>
      <LayoutPaddingVariableSetter>
        <WithHeader>
          <View />
        </WithHeader>
      </LayoutPaddingVariableSetter>
    </Card>
  </DocumentationStory>
);