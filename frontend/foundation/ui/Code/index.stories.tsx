import { DocumentationStory } from "@foundation/stories/components/DocumentationStory";
import { Code } from "@foundation/ui/Code";
import { FC } from "react";

export default {
  title: "Atoms",
};

export const Code_: FC = () => (
  <DocumentationStory>
    <Code>raise Exception(&quot;stop using javascript&quot;)</Code>
  </DocumentationStory>
);
