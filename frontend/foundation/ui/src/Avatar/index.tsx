import { SX } from "@foundation/theme";
import { View } from "../View";
import { sAvatar } from "./index.css";

type Props = {
  size: SX["h"];
};

export const Avatar: React.FC<Props> = props => (
  <View className={sAvatar} sx={{ w: props.size, h: props.size }} />
);
