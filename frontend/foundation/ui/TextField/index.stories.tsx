import { Variant } from "@foundation/stories/Variant";
import { VariantsGallery } from "@foundation/stories/VariantsGallery";
import { TextField } from "@foundation/ui/TextField";
import { atom, useAtom } from "jotai";

export default {
  title: "Components/Atoms",
};

const valueAtom = atom("I like sunset glow");

export const TextField_: React.FC = () => {
  const [value, setValue] = useAtom(valueAtom);

  return (
    <VariantsGallery columns={2}>
      <Variant label="state" value="default" />
      <TextField label="What's your favorite color?" value={value} onChange={setValue} />

      <Variant label="state" value="disabled" />
      <TextField disabled label="What's your favorite color?" value={value} onChange={setValue} />

      <Variant label="state" value="error" />
      <TextField
        errorMessage="Value is not cool enough."
        label="What's your favorite color?"
        value={value}
        onChange={setValue}
      />
    </VariantsGallery>
  );
};
