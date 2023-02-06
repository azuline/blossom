import { Card } from "@foundation/ui/Card";
import { Flex } from "@foundation/ui/Flex";
import { View } from "@foundation/ui/View";

export default {
  title: "Components/Primitives/Flex",
};

export const Row: React.FC = () => (
  <Card sx={{ maxw: "16", h: "12" }}>
    <Flex sx={{ w: "full", h: "full", gap: "4" }}>
      <View sx={{ h: "full", w: "full", bg: "primary" }} />
      <View sx={{ h: "full", w: "full", bg: "primary" }} />
      <View sx={{ h: "full", w: "full", bg: "primary" }} />
      <View sx={{ h: "full", w: "full", bg: "primary" }} />
      <View sx={{ h: "full", w: "full", bg: "primary" }} />
    </Flex>
  </Card>
);

export const Column: React.FC = () => (
  <Card sx={{ maxw: "12", h: "16" }}>
    <Flex sx={{ dir: "column", w: "full", h: "full", gap: "4" }}>
      <View sx={{ h: "full", w: "full", bg: "primary" }} />
      <View sx={{ h: "full", w: "full", bg: "primary" }} />
      <View sx={{ h: "full", w: "full", bg: "primary" }} />
      <View sx={{ h: "full", w: "full", bg: "primary" }} />
      <View sx={{ h: "full", w: "full", bg: "primary" }} />
    </Flex>
  </Card>
);
