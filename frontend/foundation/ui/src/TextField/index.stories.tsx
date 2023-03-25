import { DocumentationStory, StorySection, Variant, VariantsGallery } from "@foundation/stories";
import { TextField } from "@foundation/ui";
import { useState } from "react";

export default {
  title: "Atoms",
};

export const TextField_: React.FC = () => {
  const [value, setValue] = useState<string>("");

  return (
    <DocumentationStory>
      <StorySection title="Playground">
        <TextField label="What's your favorite color?" value={value} onChange={setValue} />
      </StorySection>
      <VariantsGallery columns={2}>
        <Variant label="state" value="default" />
        <TextField label="What's your favorite color?" value="Orange" onChange={() => {}} />

        <Variant label="state" value="disabled" />
        <TextField
          disabled
          label="What's your favorite color?"
          value="Orange"
          onChange={() => {}}
        />

        <Variant label="state" value="error" />
        <TextField
          errorMessage="Pick a better color"
          label="What's your favorite color?"
          value="Orange"
          onChange={() => {}}
        />
      </VariantsGallery>
    </DocumentationStory>
  );
};
