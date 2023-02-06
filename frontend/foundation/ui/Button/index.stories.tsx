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
    <Button size="sm" onPress={onPress}>Press me!</Button>
    <Button size="md" onPress={onPress}>Press me!</Button>
    <Button size="lg" onPress={onPress}>Press me!</Button>
    <Button size="sm" variant="outline" onPress={onPress}>Press me!</Button>
    <Button size="md" variant="outline" onPress={onPress}>Press me!</Button>
    <Button size="lg" variant="outline" onPress={onPress}>Press me!</Button>
    <Button size="sm" variant="text" onPress={onPress}>Press me!</Button>
    <Button size="md" variant="text" onPress={onPress}>Press me!</Button>
    <Button size="lg" variant="text" onPress={onPress}>Press me!</Button>

    <Button color="neutral" size="sm" onPress={onPress}>Press me!</Button>
    <Button color="neutral" size="md" onPress={onPress}>Press me!</Button>
    <Button color="neutral" size="lg" onPress={onPress}>Press me!</Button>
    <Button color="neutral" size="sm" variant="outline" onPress={onPress}>Press me!</Button>
    <Button color="neutral" size="md" variant="outline" onPress={onPress}>Press me!</Button>
    <Button color="neutral" size="lg" variant="outline" onPress={onPress}>Press me!</Button>
    <Button color="neutral" size="sm" variant="text" onPress={onPress}>Press me!</Button>
    <Button color="neutral" size="md" variant="text" onPress={onPress}>Press me!</Button>
    <Button color="neutral" size="lg" variant="text" onPress={onPress}>Press me!</Button>

    <Button color="danger" size="sm" onPress={onPress}>Press me!</Button>
    <Button color="danger" size="md" onPress={onPress}>Press me!</Button>
    <Button color="danger" size="lg" onPress={onPress}>Press me!</Button>
    <Button color="danger" size="sm" variant="outline" onPress={onPress}>Press me!</Button>
    <Button color="danger" size="md" variant="outline" onPress={onPress}>Press me!</Button>
    <Button color="danger" size="lg" variant="outline" onPress={onPress}>Press me!</Button>
    <Button color="danger" size="sm" variant="text" onPress={onPress}>Press me!</Button>
    <Button color="danger" size="md" variant="text" onPress={onPress}>Press me!</Button>
    <Button color="danger" size="lg" variant="text" onPress={onPress}>Press me!</Button>

    <Button disabled size="sm" onPress={onPress}>Press me!</Button>
    <Button disabled size="md" onPress={onPress}>Press me!</Button>
    <Button disabled size="lg" onPress={onPress}>Press me!</Button>
    <Button disabled size="sm" variant="outline" onPress={onPress}>Press me!</Button>
    <Button disabled size="md" variant="outline" onPress={onPress}>Press me!</Button>
    <Button disabled size="lg" variant="outline" onPress={onPress}>Press me!</Button>
    <Button disabled size="sm" variant="text" onPress={onPress}>Press me!</Button>
    <Button disabled size="md" variant="text" onPress={onPress}>Press me!</Button>
    <Button disabled size="lg" variant="text" onPress={onPress}>Press me!</Button>
  </View>
);
