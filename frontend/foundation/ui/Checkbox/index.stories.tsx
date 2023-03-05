import { StoryGallery } from "@foundation/stories/StoryGallery";
import { Variant } from "@foundation/stories/Variant";
import { Checkbox } from "@foundation/ui/Checkbox";
import { Flex } from "@foundation/ui/Flex";
import { Type } from "@foundation/ui/Type";
import { atom, useAtom } from "jotai";

export default {
  title: "Components/Atoms",
};

const checkedAtom = atom(false);

export const Checkbox_: React.FC = () => {
  const [checked, onChange] = useAtom(checkedAtom);

  return (
    <Flex sx={{ direction: "column", gap: "36" }}>
      <Checkbox checked={checked} label="Interactive checkbox" onChange={onChange} />
      <StoryGallery columns={3}>
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
      </StoryGallery>
    </Flex>
  );
};
