import { Card } from "@foundation/ui/Card";
import { Center } from "@foundation/ui/Center";
import { Flex } from "@foundation/ui/Flex";
import { View } from "@foundation/ui/View";

export default {
  title: "Components/Primitives",
};

export const Center_: React.FC = () => (
  <Flex sx={{ gap: "16", wrap: "wrap" }}>
    <Card sx={{ w: "272", h: "272" }}>
      <Center>
        <View sx={{ h: "128", w: "128", background: "brand.default", color: "brand.tint" }}>
          <Center>Default</Center>
        </View>
      </Center>
    </Card>
    <Card sx={{ w: "272", h: "272" }}>
      <Center axis="vertical">
        <View sx={{ h: "full", w: "128", background: "brand.default", color: "brand.tint" }}>
          <Center>Vertical</Center>
        </View>
      </Center>
    </Card>
    <Card sx={{ w: "272", h: "272" }}>
      <Center axis="horizontal">
        <View sx={{ w: "full", h: "128", background: "brand.default", color: "brand.tint" }}>
          <Center>Horizontal</Center>
        </View>
      </Center>
    </Card>
  </Flex>
);
