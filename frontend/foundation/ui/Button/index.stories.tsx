import { Button } from "@foundation/ui/Button";
import { sButtonGallery } from "@foundation/ui/Button/index.css";
import { View } from "@foundation/ui/View";

export default {
  title: "Components/Atoms/Button",
};

// eslint-disable-next-line no-alert
const onPress = (): void => alert("Pressed!");

export const Gallery: React.FC = () => (
  <View className={sButtonGallery}>
    <Button size="sm" onPress={onPress}>Sign up</Button>
    <Button size="md" onPress={onPress}>Sign up</Button>
    <Button size="lg" onPress={onPress}>Sign up</Button>
    <Button disabled size="sm" onPress={onPress}>Sign up</Button>
    <Button disabled size="md" onPress={onPress}>Sign up</Button>
    <Button disabled size="lg" onPress={onPress}>Sign up</Button>

    <Button size="sm" variant="secondary" onPress={onPress}>Sign up</Button>
    <Button size="md" variant="secondary" onPress={onPress}>Sign up</Button>
    <Button size="lg" variant="secondary" onPress={onPress}>Sign up</Button>
    <Button disabled size="sm" variant="secondary" onPress={onPress}>Sign up</Button>
    <Button disabled size="md" variant="secondary" onPress={onPress}>Sign up</Button>
    <Button disabled size="lg" variant="secondary" onPress={onPress}>Sign up</Button>

    <Button size="sm" variant="danger" onPress={onPress}>Sign up</Button>
    <Button size="md" variant="danger" onPress={onPress}>Sign up</Button>
    <Button size="lg" variant="danger" onPress={onPress}>Sign up</Button>
    <Button disabled size="sm" variant="danger" onPress={onPress}>Sign up</Button>
    <Button disabled size="md" variant="danger" onPress={onPress}>Sign up</Button>
    <Button disabled size="lg" variant="danger" onPress={onPress}>Sign up</Button>
  </View>
);
