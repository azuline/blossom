import { DocumentationStory } from "@foundation/stories/components/DocumentationStory";
import { Card } from "@foundation/ui/Card";
import { Spacer } from "@foundation/ui/Spacer";
import { Stack } from "@foundation/ui/Stack";
import { Type } from "@foundation/ui/Type";
import { View } from "@foundation/ui/View";

export default {
  title: "Layout",
};

export const Spacer_: React.FC = () => (
  <DocumentationStory>
    <Card sx={{ w: "356", h: "128" }}>
      <Stack axis="y" gap="8" sx={{ h: "full" }}>
        <Type>Horizontal</Type>
        <Stack axis="x" sx={{ w: "full", h: "full" }}>
          <View sx={{ h: "full", w: "64", background: "brand.default" }} />
          <Spacer x="64" />
          <View sx={{ h: "full", w: "64", background: "brand.default" }} />
          <Spacer x="20" />
          <View sx={{ h: "full", w: "64", background: "brand.default" }} />
        </Stack>
      </Stack>
    </Card>
    <Card sx={{ w: "128", h: "356" }}>
      <Stack axis="y" gap="8" sx={{ h: "full" }}>
        <Type>Vertical</Type>
        <Stack axis="y" sx={{ w: "full", h: "full" }}>
          <View sx={{ h: "64", w: "full", background: "brand.default" }} />
          <Spacer y="64" />
          <View sx={{ h: "64", w: "full", background: "brand.default" }} />
          <Spacer y="20" />
          <View sx={{ h: "64", w: "full", background: "brand.default" }} />
        </Stack>
      </Stack>
    </Card>
  </DocumentationStory>
);
