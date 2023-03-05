import { Card } from "@foundation/ui/Card";
import { Center } from "@foundation/ui/Center";
import { Flex } from "@foundation/ui/Flex";

export default {
  title: "Components/Primitives/Flex",
};

export const Gallery: React.FC = () => (
  <Flex sx={{ direction: "column", gap: "16" }}>
    <Card sx={{ w: "356", h: "128" }}>
      <Flex sx={{ w: "full", h: "full", gap: "8" }}>
        <Center sx={{ h: "full", w: "full", background: "brand.default", color: "brand.tint" }}>
          Row
        </Center>
        <Center sx={{ h: "full", w: "full", background: "brand.default", color: "brand.tint" }}>
          Row
        </Center>
        <Center sx={{ h: "full", w: "full", background: "brand.default", color: "brand.tint" }}>
          Row
        </Center>
        <Center sx={{ h: "full", w: "full", background: "brand.default", color: "brand.tint" }}>
          Row
        </Center>
        <Center sx={{ h: "full", w: "full", background: "brand.default", color: "brand.tint" }}>
          Row
        </Center>
      </Flex>
    </Card>
    <Card sx={{ w: "128", h: "356" }}>
      <Flex sx={{ direction: "column", w: "full", h: "full", gap: "8" }}>
        <Center sx={{ h: "full", w: "full", background: "brand.default", color: "brand.tint" }}>
          Column
        </Center>
        <Center sx={{ h: "full", w: "full", background: "brand.default", color: "brand.tint" }}>
          Column
        </Center>
        <Center sx={{ h: "full", w: "full", background: "brand.default", color: "brand.tint" }}>
          Column
        </Center>
        <Center sx={{ h: "full", w: "full", background: "brand.default", color: "brand.tint" }}>
          Column
        </Center>
        <Center sx={{ h: "full", w: "full", background: "brand.default", color: "brand.tint" }}>
          Column
        </Center>
      </Flex>
    </Card>
  </Flex>
);
