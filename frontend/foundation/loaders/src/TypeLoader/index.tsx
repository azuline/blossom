import { SX, t } from "@foundation/theme";
import { View } from "@foundation/ui";
import { sTypeLoader } from "./index.css";

type Props = {
  size?: keyof typeof t.font.size.body;
  w: SX["w"];
};

export const TypeLoader: React.FC<Props> = props => (
  <View className={sTypeLoader({ size: props.size })} sx={{ w: props.w }} />
);
