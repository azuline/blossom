import { Code } from "@foundation/ui";
import { FC } from "react";
import { DocumentationStory } from "../lib/DocumentationStory";

export default {
  title: "Atoms",
};

export const Code_: FC = () => (
  <DocumentationStory>
    <Code>raise Exception(&quot;stop using javascript&quot;)</Code>
  </DocumentationStory>
);
