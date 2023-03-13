import { PageStory } from "@foundation/stories/PageStory";
import HomePage from ".";

export default {
  title: "Pages",
};

export const Home: React.FC = () => (
  <PageStory>
    <HomePage />
  </PageStory>
);
