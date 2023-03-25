import { DocumentationStory } from "@foundation/stories";
import { StorySection } from "@foundation/stories";
import { Link } from "@foundation/ui";
import { Type } from "@foundation/ui";
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
