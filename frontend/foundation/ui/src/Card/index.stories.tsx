import { DocumentationStory, Variant, VariantsGallery } from "@foundation/stories";
import { Card, Type } from "@foundation/ui";

export default {
  title: "Atoms",
};

// dprint-ignore
export const Card_: React.FC = () => (
  <DocumentationStory>
    <VariantsGallery columns={5}>
      <Type />
      <Variant label="padding" value="none" />
      <Variant label="padding" value="sm" />
      <Variant label="padding" value="md" />
      <Variant label="padding" value="lg" />

      <Variant label="variant" value="strong" />
      <Card padding="none" sx={{ maxw: "272" }} variant="strong"><Text1 /></Card>
      <Card padding="sm" sx={{ maxw: "272" }} variant="strong"><Text1 /></Card>
      <Card padding="md" sx={{ maxw: "272" }} variant="strong"><Text1 /></Card>
      <Card padding="lg" sx={{ maxw: "272" }} variant="strong"><Text1 /></Card>

      <Variant label="variant" value="default" />
      <Card padding="none" sx={{ maxw: "272" }} variant="default"><Text2 /></Card>
      <Card padding="sm" sx={{ maxw: "272" }} variant="default"><Text2 /></Card>
      <Card padding="md" sx={{ maxw: "272" }} variant="default"><Text2 /></Card>
      <Card padding="lg" sx={{ maxw: "272" }} variant="default"><Text2 /></Card>

      <Variant label="variant" value="inverse" />
      <Card padding="none" sx={{ maxw: "272" }} variant="inverse"><Text3 /></Card>
      <Card padding="sm" sx={{ maxw: "272" }} variant="inverse"><Text3 /></Card>
      <Card padding="md" sx={{ maxw: "272" }} variant="inverse"><Text3 /></Card>
      <Card padding="lg" sx={{ maxw: "272" }} variant="inverse"><Text3 /></Card>
    </VariantsGallery>
  </DocumentationStory>
);

const Text1: React.FC = () => (
  <Type paragraph>
    There is a beginning. There is no beginning of that beginning. There is no beginning of that no
    beginning of beginning.
  </Type>
);

const Text2: React.FC = () => (
  <Type paragraph>
    There is something. There is nothing. There is something before the beginning of something and
    nothing, and something before that.
  </Type>
);

const Text3: React.FC = () => (
  <Type paragraph>
    Now, I’ve just said something, but I don’t really know whether I’ve said anything or not.
  </Type>
);
