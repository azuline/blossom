import { PageStory } from "@foundation/stories/PageStory";
import LoginPage from ".";

export default {
  title: "Pages/Login",
};

export const Default: React.FC = () => (
  <PageStory>
    <LoginPage />
  </PageStory>
);
