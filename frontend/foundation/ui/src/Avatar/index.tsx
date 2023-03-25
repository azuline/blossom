import { SX } from "@foundation/theme";
import { sAvatar, View } from "@foundation/ui";

type Props = {
  size: SX["h"];
};

export const Avatar: React.FC<Props> = props => (
  <View className={sAvatar} sx={{ w: props.size, h: props.size }} />
);
