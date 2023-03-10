import { PageContent } from "@foundation/layout/PageContent";
import { WithHeader } from "@foundation/layout/WithHeader";
import { DocumentationStory } from "@foundation/stories/DocumentationStory";
import { Card } from "@foundation/ui/Card";
import { Type } from "@foundation/ui/Type";

export default {
  title: "Layout",
};

export const WithHeader_: React.FC = () => (
  <DocumentationStory>
    <Card sx={{ w: "704", h: "356" }}>
      <WithHeader>
        <PageContent>
          <Type paragraph>
            Loren ipsun loren ipsun loren ipsun loren ipsun loren ipsun loren ipsun loren ipsun
            loren ipsun loren ipsun loren ipsun loren ipsun loren ipsun loren ipsun loren ipsun
            loren ipsun loren ipsun loren ipsun loren ipsun loren ipsun loren ipsun loren ipsun
            loren ipsun loren ipsun loren ipsun loren ipsun loren ipsun loren ipsun loren ipsun
            loren ipsun loren ipsun loren ipsun loren ipsun loren ipsun loren ipsun loren ipsun
            loren ipsun loren ipsun loren ipsun loren ipsun loren ipsun loren ipsun loren ipsun
            loren ipsun loren ipsun loren ipsun loren ipsun
          </Type>
        </PageContent>
      </WithHeader>
    </Card>
  </DocumentationStory>
);
