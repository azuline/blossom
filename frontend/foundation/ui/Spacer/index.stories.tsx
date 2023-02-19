import { Card } from "@foundation/ui/Card";
import { Flex } from "@foundation/ui/Flex";
import { Spacer } from "@foundation/ui/Spacer";
import { Type } from "@foundation/ui/Type";
import { View } from "@foundation/ui/View";

export default {
  title: "Components/Primitives/Spacer",
};

export const Gallery: React.FC = () => (
  <Flex sx={{ wrap: "wrap", gap: "16" }}>
    <Card sx={{ w: "356", h: "128" }}>
      <Flex sx={{ dir: "column", h: "full", gap: "8" }}>
        <Type>Horizontal</Type>
        <Flex sx={{ w: "full", h: "full" }}>
          <View sx={{ h: "full", w: "64", bg: "brand.default" }} />
          <Spacer x="64" />
          <View sx={{ h: "full", w: "64", bg: "brand.default" }} />
          <Spacer x="20" />
          <View sx={{ h: "full", w: "64", bg: "brand.default" }} />
        </Flex>
      </Flex>
    </Card>
    <Card sx={{ w: "128", h: "356" }}>
      <Flex sx={{ dir: "column", h: "full", gap: "8" }}>
        <Type>Vertical</Type>
        <Flex sx={{ dir: "column", w: "full", h: "full" }}>
          <View sx={{ h: "64", w: "full", bg: "brand.default" }} />
          <Spacer y="64" />
          <View sx={{ h: "64", w: "full", bg: "brand.default" }} />
          <Spacer y="20" />
          <View sx={{ h: "64", w: "full", bg: "brand.default" }} />
        </Flex>
      </Flex>
    </Card>
  </Flex>
);
