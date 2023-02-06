import { Center } from "@foundation/ui/Center";
import { Type } from "@foundation/ui/Type";
import { ApplicationLayout } from "@product/layout";

const HomePage: React.FC = () => (
  <ApplicationLayout>
    <Center sx={{ h: "full" }}>
      <Type sx={{ text: "disp-xxl" }}>Hi, welcome home!</Type>
    </Center>
  </ApplicationLayout>
);

export default HomePage;
