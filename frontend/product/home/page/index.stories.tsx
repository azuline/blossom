import { PageStory } from "@foundation/stories/PageStory";
import HomePage from ".";

export default {
  title: "Pages/Home",
};

export const Default: React.FC = () => (
  <PageStory>
    <HomePage />
  </PageStory>
);
