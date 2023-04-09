import { PageStory } from "@foundation/stories";
import HomePage from ".";

export default {
  title: "Pages",
};

export const Home: React.FC = () => (
  <PageStory>
    <HomePage />
  </PageStory>
);
