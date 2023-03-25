import { SX } from "@foundation/theme/styles/sprinkles.css";
import { sAvatar } from "@foundation/ui/Avatar/index.css";
import { View } from "@foundation/ui";

type Props = {
  size: SX["h"];
};

export const Avatar: React.FC<Props> = props => (
  <View className={sAvatar} sx={{ w: props.size, h: props.size }} />
);
