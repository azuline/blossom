import { sTypeLoader } from "@foundation/loaders/TypeLoader/index.css";
import { t } from "@foundation/theme/styles";
import { SX } from "@foundation/theme/styles/sprinkles.css";
import { View } from "@foundation/ui/View";

type Props = {
  size?: keyof typeof t.font.size.body;
  w: SX["w"];
};

export const TypeLoader: React.FC<Props> = props => (
  <View className={sTypeLoader({ size: props.size })} sx={{ w: props.w }} />
);
