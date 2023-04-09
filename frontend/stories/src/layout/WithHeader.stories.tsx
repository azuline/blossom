import { LayoutPaddingVariableSetter } from "@foundation/layout";
import { WithHeader } from "@foundation/layout/dist/src/WithHeader";
import { Card, View } from "@foundation/ui";
import { DocumentationStory } from "../lib/DocumentationStory";

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
