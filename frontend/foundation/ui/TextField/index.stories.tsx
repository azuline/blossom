import { Flex } from "@foundation/ui/Flex";
import { TextField } from "@foundation/ui/TextField";
import { atom, useAtom } from "jotai";

export default {
  title: "Components/Atoms/TextField",
};

const valueAtom = atom("Type on me");

export const Gallery: React.FC = () => {
  const [value, setValue] = useAtom(valueAtom);

  return (
    <Flex sx={{ direction: "column", maxw: "356", gap: "28" }}>
      <TextField label="Default" value={value} onChange={setValue} />
      <TextField disabled label="Disabled" value={value} onChange={setValue} />
      <TextField
        errorMessage="Value is not cool enough."
        label="Errored"
        value={value}
        onChange={setValue}
      />
    </Flex>
  );
};
