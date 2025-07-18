import LoginPage from "@product/login";
import { PageStory } from "../lib/PageStory";

export default {
  title: "Pages",
};

export const Login: React.FC = () => (
  <PageStory>
    <LoginPage />
  </PageStory>
);
