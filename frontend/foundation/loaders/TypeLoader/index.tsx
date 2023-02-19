import { sTypeLoader } from "@foundation/loaders/TypeLoader/index.css";
import { SX } from "@foundation/style/sprinkles.css";
import { t } from "@foundation/style/theme.css";
import { View } from "@foundation/ui/View";

type Props = {
  size?: keyof typeof t.font.size;
  w: SX["w"];
};

export const TypeLoader: React.FC<Props> = props => (
  <View className={sTypeLoader({ size: props.size })} sx={{ w: props.w }} />
);
