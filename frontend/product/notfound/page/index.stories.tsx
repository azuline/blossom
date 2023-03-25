import { PageStory } from "@foundation/stories";
import NotFoundPage from ".";

export default {
  title: "Pages",
};

export const NotFound: React.FC = () => (
  <PageStory>
    <NotFoundPage />
  </PageStory>
);
