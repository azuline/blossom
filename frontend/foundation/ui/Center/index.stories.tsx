import { Card } from "@foundation/ui/Card";
import { Center } from "@foundation/ui/Center";
import { View } from "@foundation/ui/View";

export default {
  title: "Components/Primitives/Center",
};

export const BothAxes: React.FC = () => (
  <Card sx={{ maxw: "16", h: "16" }}>
    <Center sx={{ w: "full", h: "full" }}>
      <View sx={{ h: "12", w: "12", bg: "primary" }} />
    </Center>
  </Card>
);

export const Vertically: React.FC = () => (
  <Card sx={{ maxw: "16", h: "16" }}>
    <Center axis="vertical" sx={{ w: "full", h: "full" }}>
      <View sx={{ h: "full", w: "12", bg: "primary" }} />
    </Center>
  </Card>
);

export const Horizontally: React.FC = () => (
  <Card sx={{ maxw: "16", h: "16" }}>
    <Center axis="horizontal" sx={{ w: "full", h: "full" }}>
      <View sx={{ w: "full", h: "12", bg: "primary" }} />
    </Center>
  </Card>
);
