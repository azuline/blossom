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
            <Type sx={{ col: "neutral.weak" }}>
              Lauren ipson lauren ipson lauren ipson lauren ipson lauren ipson lauren ipson lauren
              ipson lauren ipson lauren ipson.
            </Type>
          </Flex>
          <Button onPress={() => {}}>CTA Here</Button>
        </Flex>
      </Center>
    </LayoutPadding>
  </WithHeader>
);

export default HomePage;
