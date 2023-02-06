import { TextField } from "@foundation/ui/TextField";
import { atom, useAtom } from "jotai";

export default {
  title: "Components/Atoms/TextField",
};

const valueAtom = atom("Lorem ipsun");

export const Default: React.FC = () => {
  const [value, setValue] = useAtom(valueAtom);
  return <TextField label="Label" value={value} onChange={setValue} />;
};

export const Disabled: React.FC = () => {
  const [value, setValue] = useAtom(valueAtom);
  return <TextField disabled label="Label" value={value} onChange={setValue} />;
};

export const Error: React.FC = () => {
  const [value, setValue] = useAtom(valueAtom);
  return (
    <TextField
      errorMessage="Value is not cool enough."
      label="Label"
      value={value}
      onChange={setValue}
    />
  );
};
