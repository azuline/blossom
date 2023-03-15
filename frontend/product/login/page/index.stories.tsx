import { PageStory } from "@foundation/stories/components/PageStory";
import LoginPage from ".";

export default {
  title: "Pages",
};

export const Login: React.FC = () => (
  <PageStory>
    <LoginPage />
  </PageStory>
);
