import { LayoutPaddingVariableSetter } from "@foundation/layout/LayoutPaddingVariableSetter";
import { WithHeader } from "@foundation/layout/WithHeader";
import { DocumentationStory } from "@foundation/stories/components/DocumentationStory";
import { Card } from "@foundation/ui";
import { View } from "@foundation/ui";

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
