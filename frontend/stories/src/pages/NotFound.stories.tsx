import NotFoundPage from "@product/notfound";
import { PageStory } from "../lib/PageStory";

export default {
  title: "Pages",
};

export const NotFound: React.FC = () => (
  <PageStory>
    <NotFoundPage />
  </PageStory>
);
