import { DocumentationStory } from "@foundation/stories/components/DocumentationStory";
import { StorySection } from "@foundation/stories/components/StorySection";
import { Variant } from "@foundation/stories/components/Variant";
import { VariantsGallery } from "@foundation/stories/components/VariantsGallery";
import { Button } from "@foundation/ui/Button";
import { Type } from "@foundation/ui/Type";
import { useState } from "react";

export default {
  title: "Atoms",
};

const onPress = (): void => {};

export const Button_: React.FC = () => {
  const [presses, setPresses] = useState<number>(0);
  return (
    <DocumentationStory>
      <StorySection title="Playground">
        <Button onPress={() => setPresses(p => p + 1)}>Presses: {presses}</Button>
      </StorySection>
      <VariantsGallery columns={5}>
        <Type />
        <Type />
        <Variant label="size" value="sm" />
        <Variant label="size" value="md" />
        <Variant label="size" value="lg" />

        <Variant label="variant" value="primary" />
        <Variant label="state" value="enabled" />
        <Button size="sm" onPress={onPress}>Sign up</Button>
        <Button size="md" onPress={onPress}>Sign up</Button>
        <Button size="lg" onPress={onPress}>Sign up</Button>

        <Type />
        <Variant label="state" value="disabled" />
        <Button disabled size="sm" onPress={onPress}>Sign up</Button>
        <Button disabled size="md" onPress={onPress}>Sign up</Button>
        <Button disabled size="lg" onPress={onPress}>Sign up</Button>

        <Variant label="variant" value="secondary" />
        <Variant label="state" value="enabled" />
        <Button size="sm" variant="secondary" onPress={onPress}>Sign up</Button>
        <Button size="md" variant="secondary" onPress={onPress}>Sign up</Button>
        <Button size="lg" variant="secondary" onPress={onPress}>Sign up</Button>

        <Type />
        <Variant label="state" value="disabled" />
        <Button disabled size="sm" variant="secondary" onPress={onPress}>Sign up</Button>
        <Button disabled size="md" variant="secondary" onPress={onPress}>Sign up</Button>
        <Button disabled size="lg" variant="secondary" onPress={onPress}>Sign up</Button>

        <Variant label="variant" value="danger" />
        <Variant label="state" value="enabled" />
        <Button size="sm" variant="danger" onPress={onPress}>Sign up</Button>
        <Button size="md" variant="danger" onPress={onPress}>Sign up</Button>
        <Button size="lg" variant="danger" onPress={onPress}>Sign up</Button>

        <Type />
        <Variant label="state" value="disabled" />
        <Button disabled size="sm" variant="danger" onPress={onPress}>Sign up</Button>
        <Button disabled size="md" variant="danger" onPress={onPress}>Sign up</Button>
        <Button disabled size="lg" variant="danger" onPress={onPress}>Sign up</Button>
      </VariantsGallery>
    </DocumentationStory>
  );
};
