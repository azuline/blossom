import { PageContent } from "@foundation/layout/PageContent";
import { WithHeader } from "@foundation/layout/WithHeader";
import { Button } from "@foundation/ui/Button";
import { Flex } from "@foundation/ui/Flex";
import { Type } from "@foundation/ui/Type";

const HomePage: React.FC = () => (
  <WithHeader>
    <PageContent center topPadding>
      <Flex sx={{ direction: "column", gap: "36" }}>
        <Flex sx={{ direction: "column", gap: "12", maxw: "480" }}>
          <Type variant="disp-lg">Hi, hello, welcome home!</Type>
          <Type paragraph>
            In the Northern Ocean there is a fish called Kun which is many thousand li in size. It
            changes into a bird named Peng whose back is many thousand li in breadth. When it rises
            and flies, its wings are like clouds filling the sky.
          </Type>
        </Flex>
        <Button onPress={() => {}}>CTA Here</Button>
      </Flex>
    </PageContent>
  </WithHeader>
);

export default HomePage;
