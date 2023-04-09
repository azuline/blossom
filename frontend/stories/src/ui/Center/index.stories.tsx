import { DocumentationStory } from "@foundation/stories";
import { Card, Center, Stack, View } from "@foundation/ui";

export default {
  title: "Layout",
};

export const Center_: React.FC = () => (
  <DocumentationStory>
    <Stack wrap axis="x" gap="16">
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
    </Stack>
  </DocumentationStory>
);
