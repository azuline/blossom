import { Checkbox } from "@foundation/ui/Checkbox";
import { Flex } from "@foundation/ui/Flex";
import { atom, useAtom } from "jotai";

export default {
  title: "Components/Atoms/Checkbox",
};

const checkedAtom = atom(false);

export const Gallery: React.FC = () => {
  const [checked, onChange] = useAtom(checkedAtom);

  return (
    <Flex sx={{ direction: "column", gap: "16" }}>
      <Checkbox checked={checked} label="Interactive checkbox" onChange={onChange} />
      <Checkbox checked label="Checked" onChange={() => {}} />
      <Checkbox disabled checked={false} label="Disabled unchecked" onChange={() => {}} />
      <Checkbox checked disabled label="Disabled checked" onChange={() => {}} />
    </Flex>
  );
};
