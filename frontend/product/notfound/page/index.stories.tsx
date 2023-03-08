import { PageStory } from "@foundation/stories/PageStory";
import NotFoundPage from ".";

export default {
  title: "Pages/NotFound",
};

export const Default: React.FC = () => (
  <PageStory>
    <NotFoundPage />
  </PageStory>
);
