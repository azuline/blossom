import { WithHeader } from "@foundation/layout/WithHeader";
import { DocumentationStory } from "@foundation/stories/DocumentationStory";
import { Card } from "@foundation/ui/Card";
import { View } from "@foundation/ui/View";

export default {
  title: "Molecules",
};

export const Header_: React.FC = () => (
  <DocumentationStory>
    <Card sx={{ w: "704", h: "356" }}>
      <WithHeader>
        <View />
      </WithHeader>
    </Card>
  </DocumentationStory>
);
