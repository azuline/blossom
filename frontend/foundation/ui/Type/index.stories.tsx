import { DocumentationStory } from "@foundation/stories/DocumentationStory";
import { Variant, VariantGroup } from "@foundation/stories/Variant";
import { VariantsGallery } from "@foundation/stories/VariantsGallery";
import { Type } from "@foundation/ui/Type";

export default {
  title: "Components/Primitives",
};

// dprint-ignore
export const Type_: React.FC = () => (
  <DocumentationStory>
    <VariantsGallery columns={5} justifyItems="start">
      <Type />
      <Type />
      <Variant label="strong" value="true" />
      <Variant label="italic" value="true" />
      <Variant label="underline" value="true" />

      <Variant label="variant" value="disp-xxl" />
      <Type variant="disp-xxl">Disp / XXL</Type>
      <Type strong variant="disp-xxl">Disp / XXL</Type>
      <Type italic variant="disp-xxl">Disp / XXL</Type>
      <Type underline variant="disp-xxl">Disp / XXL</Type>

      <Variant label="variant" value="disp-xl" />
      <Type variant="disp-xl">Disp / XL</Type>
      <Type strong variant="disp-xl">Disp / XL</Type>
      <Type italic variant="disp-xl">Disp / XL</Type>
      <Type underline variant="disp-xl">Disp / XL</Type>

      <Variant label="variant" value="disp-lg" />
      <Type variant="disp-lg">Disp / LG</Type>
      <Type strong variant="disp-lg">Disp / LG</Type>
      <Type italic variant="disp-lg">Disp / LG</Type>
      <Type underline variant="disp-lg">Disp / LG</Type>

      <Variant label="variant" value="disp-md" />
      <Type variant="disp-md">Disp / MD</Type>
      <Type strong variant="disp-md">Disp / MD</Type>
      <Type italic variant="disp-md">Disp / MD</Type>
      <Type underline variant="disp-md">Disp / MD</Type>

      <Variant label="variant" value="disp-sm" />
      <Type variant="disp-sm">Disp / SM</Type>
      <Type strong variant="disp-sm">Disp / SM</Type>
      <Type italic variant="disp-sm">Disp / SM</Type>
      <Type underline variant="disp-sm">Disp / SM</Type>

      <Variant label="variant" value="lg" />
      <Type variant="lg">Label / LG</Type>
      <Type strong variant="lg">Label / LG</Type>
      <Type italic variant="lg">Label / LG</Type>
      <Type underline variant="lg">Label / LG</Type>

      <Variant label="variant" value="md" />
      <Type variant="md">Label / MD</Type>
      <Type strong variant="md">Label / MD</Type>
      <Type italic variant="md">Label / MD</Type>
      <Type underline variant="md">Label / MD</Type>

      <Variant label="variant" value="sm" />
      <Type variant="sm">Label / SM</Type>
      <Type strong variant="sm">Label / SM</Type>
      <Type italic variant="sm">Label / SM</Type>
      <Type underline variant="sm">Label / SM</Type>

      <Variant label="variant" value="xs" />
      <Type variant="xs">Label / XS</Type>
      <Type strong variant="xs">Label / XS</Type>
      <Type italic variant="xs">Label / XS</Type>
      <Type underline variant="xs">Label / XS</Type>

      <VariantGroup>
        <Variant label="variant" value="lg" />
        <Variant label="paragraph" value="true" />
      </VariantGroup>
      <Type paragraph variant="lg">Paragraph / LG<br />Paragraph / LG</Type>
      <Type paragraph strong variant="lg">Paragraph / LG<br />Paragraph / LG</Type>
      <Type italic paragraph variant="lg">Paragraph / LG<br />Paragraph / LG</Type>
      <Type paragraph underline variant="lg">Paragraph / LG<br />Paragraph / LG</Type>

      <VariantGroup>
        <Variant label="variant" value="md" />
        <Variant label="paragraph" value="true" />
      </VariantGroup>
      <Type paragraph variant="md">Paragraph / MD<br />Paragraph / MD</Type>
      <Type paragraph strong variant="md">Paragraph / MD<br />Paragraph / MD</Type>
      <Type italic paragraph variant="md">Paragraph / MD<br />Paragraph / MD</Type>
      <Type paragraph underline variant="md">Paragraph / MD<br />Paragraph / MD</Type>

      <VariantGroup>
        <Variant label="variant" value="sm" />
        <Variant label="paragraph" value="true" />
      </VariantGroup>
      <Type paragraph variant="sm">Paragraph / SM<br />Paragraph / SM</Type>
      <Type paragraph strong variant="sm">Paragraph / SM<br />Paragraph / SM</Type>
      <Type italic paragraph variant="sm">Paragraph / SM<br />Paragraph / SM</Type>
      <Type paragraph underline variant="sm">Paragraph / SM<br />Paragraph / SM</Type>

      <VariantGroup>
        <Variant label="variant" value="xs" />
        <Variant label="paragraph" value="true" />
      </VariantGroup>
      <Type paragraph variant="xs">Paragraph / XS<br />Paragraph / XS</Type>
      <Type paragraph strong variant="xs">Paragraph / XS<br />Paragraph / XS</Type>
      <Type italic paragraph variant="xs">Paragraph / XS<br />Paragraph / XS</Type>
      <Type paragraph underline variant="xs">Paragraph / XS<br />Paragraph / XS</Type>
    </VariantsGallery>
  </DocumentationStory>
);
