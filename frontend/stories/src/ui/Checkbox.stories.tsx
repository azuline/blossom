import { Checkbox, Type } from "@foundation/ui";
import { atom, useAtom } from "jotai";
import { DocumentationStory } from "../lib/DocumentationStory";
import { StorySection } from "../lib/StorySection";
import { Variant } from "../lib/Variant";
import { VariantsGallery } from "../lib/VariantsGallery";

export default {
  title: "Atoms",
};

const checkedAtom = atom(false);

export const Checkbox_: React.FC = () => {
  const [checked, onChange] = useAtom(checkedAtom);

  return (
    <DocumentationStory>
      <StorySection title="Playground">
        <Checkbox checked={checked} label="Interactive checkbox" onChange={onChange} />
      </StorySection>
      <VariantsGallery columns={3}>
        <Type />
        <Variant label="checked" value="false" />
        <Variant label="checked" value="true" />

        <Variant label="state" value="default" />
        <Checkbox checked={false} label="Remember me" />
        <Checkbox checked label="Remember me" />

        <Variant label="state" value="disabled" />
        <Checkbox disabled checked={false} label="Remember me" />
        <Checkbox checked disabled label="Remember me" />

        <Variant label="state" value="error" />
        <Checkbox error checked={false} label="Remember me" />
        <Checkbox checked error label="Remember me" />

        <Variant label="state" value="error+disabled" />
        <Checkbox disabled error checked={false} label="Remember me" />
        <Checkbox checked disabled error label="Remember me" />
      </VariantsGallery>
    </DocumentationStory>
  );
};
