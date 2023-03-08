import { DocumentationStory } from "@foundation/stories/DocumentationStory";
import { Variant } from "@foundation/stories/Variant";
import { VariantsGallery } from "@foundation/stories/VariantsGallery";
import { Button } from "@foundation/ui/Button";
import { Type } from "@foundation/ui/Type";

export default {
  title: "Components/Atoms",
};

// eslint-disable-next-line no-alert
const onPress = (): void => alert("Pressed!");

export const Button_: React.FC = () => (
  <DocumentationStory>
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
