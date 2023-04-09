import HomePage from "@product/home";
import { PageStory } from "../lib/PageStory";

export default {
  title: "Pages",
};

export const Home: React.FC = () => (
  <PageStory>
    <HomePage />
  </PageStory>
);
