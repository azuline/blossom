import { DocumentationStory } from "@foundation/stories/DocumentationStory";
import { Card } from "@foundation/ui/Card";
import { Flex } from "@foundation/ui/Flex";
import { Spacer } from "@foundation/ui/Spacer";
import { Type } from "@foundation/ui/Type";
import { View } from "@foundation/ui/View";

export default {
  title: "Layout",
};

export const Spacer_: React.FC = () => (
  <DocumentationStory>
    <Card sx={{ w: "356", h: "128" }}>
      <Flex sx={{ direction: "column", h: "full", gap: "8" }}>
        <Type>Horizontal</Type>
        <Flex sx={{ w: "full", h: "full" }}>
          <View sx={{ h: "full", w: "64", background: "brand.default" }} />
          <Spacer x="64" />
          <View sx={{ h: "full", w: "64", background: "brand.default" }} />
          <Spacer x="20" />
          <View sx={{ h: "full", w: "64", background: "brand.default" }} />
        </Flex>
      </Flex>
    </Card>
    <Card sx={{ w: "128", h: "356" }}>
      <Flex sx={{ direction: "column", h: "full", gap: "8" }}>
        <Type>Vertical</Type>
        <Flex sx={{ direction: "column", w: "full", h: "full" }}>
          <View sx={{ h: "64", w: "full", background: "brand.default" }} />
          <Spacer y="64" />
          <View sx={{ h: "64", w: "full", background: "brand.default" }} />
          <Spacer y="20" />
          <View sx={{ h: "64", w: "full", background: "brand.default" }} />
        </Flex>
      </Flex>
    </Card>
  </DocumentationStory>
);
