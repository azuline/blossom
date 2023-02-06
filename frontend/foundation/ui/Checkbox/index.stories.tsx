import { Checkbox } from "@foundation/ui/Checkbox";
import { atom, useAtom } from "jotai";

export default {
  title: "Components/Atoms/Checkbox",
};

const checkedAtom = atom(false);

export const DefaultInteractive: React.FC = () => {
  const [checked, onChange] = useAtom(checkedAtom);
  return <Checkbox checked={checked} label="Check me!" onChange={onChange} />;
};

export const Checked: React.FC = () => <Checkbox checked label="Check me!" onChange={() => {}} />;

export const DisabledUnchecked: React.FC = () => (
  <Checkbox disabled checked={false} label="Check me!" onChange={() => {}} />
);

export const DisabledChecked: React.FC = () => (
  <Checkbox checked disabled label="Check me!" onChange={() => {}} />
);
