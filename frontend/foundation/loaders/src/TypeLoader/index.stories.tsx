import { TypeLoader } from "@foundation/loaders";
import { DocumentationStory, Variant, VariantsGallery } from "@foundation/stories";
import { Type } from "@foundation/ui";

export default {
  title: "Loaders",
};

export const Type_: React.FC = () => (
  <DocumentationStory>
    <VariantsGallery columns={4}>
      <Type />
      <Variant label="size" value="sm" />
      <Variant label="size" value="md" />
      <Variant label="size" value="lg" />

      <Variant label="width" value="128" />
      <TypeLoader size="sm" w="128" />
      <TypeLoader size="md" w="128" />
      <TypeLoader size="lg" w="128" />
    </VariantsGallery>
  </DocumentationStory>
);
