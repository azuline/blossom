import { DocumentationStory } from "@foundation/stories/DocumentationStory";
import { StorySection } from "@foundation/stories/StorySection";
import { Link } from "@foundation/ui/Link";
import { Type } from "@foundation/ui/Type";
import { FC } from "react";

export default {
  title: "Hello",
};

export const Introduction: FC = () => (
  <DocumentationStory>
    <StorySection title="Hi~~">
      <Type>
        This site presents the stories for{" "}
        <Link href="https://github.com/azuline/blossom">blossom</Link>.
      </Type>
    </StorySection>
  </DocumentationStory>
);
