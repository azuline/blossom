import { StorySection } from "@foundation/stories/StorySection";
import { Variant } from "@foundation/stories/Variant";
import { VariantsGallery } from "@foundation/stories/VariantsGallery";
import { Checkbox } from "@foundation/ui/Checkbox";
import { Type } from "@foundation/ui/Type";
import { atom, useAtom } from "jotai";

export default {
  title: "Components/Atoms",
};

const checkedAtom = atom(false);

export const Checkbox_: React.FC = () => {
  const [checked, onChange] = useAtom(checkedAtom);

  return (
    <>
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
    </>
  );
};
