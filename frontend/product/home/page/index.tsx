import { LayoutPadding } from "@foundation/layout/LayoutPadding";
import { WithHeader } from "@foundation/layout/WithHeader";
import { Button } from "@foundation/ui/Button";
import { Center } from "@foundation/ui/Center";
import { Flex } from "@foundation/ui/Flex";
import { Type } from "@foundation/ui/Type";

const HomePage: React.FC = () => (
  <WithHeader>
    <LayoutPadding>
      <Center sx={{ h: "full" }}>
        <Flex sx={{ dir: "column", gap: "36" }}>
          <Flex sx={{ dir: "column", gap: "12", maxw: "480" }}>
            <Type sx={{ text: "disp-lg" }}>Hi, hello, welcome home!</Type>
            <Type sx={{ col: "neutral.weak", paragraph: "true" }}>
              In the Northern Ocean there is a fish called Kun which is many thousand li in size. It
              changes into a bird named Peng whose back is many thousand li in breadth. When it
              rises and flies, its wings are like clouds filling the sky.
            </Type>
          </Flex>
          <Button onPress={() => {}}>CTA Here</Button>
        </Flex>
      </Center>
    </LayoutPadding>
  </WithHeader>
);

export default HomePage;
