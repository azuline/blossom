import { Card } from "@foundation/ui/Card";
import { Flex } from "@foundation/ui/Flex";
import { Spacer } from "@foundation/ui/Spacer";
import { View } from "@foundation/ui/View";

export default {
  title: "Components/Primitives/Spacer",
};

export const Horizontal: React.FC = () => (
  <Card sx={{ maxw: "16", h: "12" }}>
    <Flex sx={{ w: "full", h: "full" }}>
      <View sx={{ h: "full", w: "10", bg: "primary" }} />
      <Spacer x="10" />
      <View sx={{ h: "full", w: "10", bg: "primary" }} />
      <Spacer x="7" />
      <View sx={{ h: "full", w: "10", bg: "primary" }} />
    </Flex>
  </Card>
);
export const Vertical: React.FC = () => (
  <Card sx={{ maxw: "12", h: "16" }}>
    <Flex sx={{ dir: "column", w: "full", h: "full" }}>
      <View sx={{ h: "10", w: "full", bg: "primary" }} />
      <Spacer y="10" />
      <View sx={{ h: "10", w: "full", bg: "primary" }} />
      <Spacer y="7" />
      <View sx={{ h: "10", w: "full", bg: "primary" }} />
    </Flex>
  </Card>
);
