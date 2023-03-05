import { Type } from "@foundation/ui/Type";
import { View } from "@foundation/ui/View";

export default {
  title: "Components/Primitives/View",
};

export const Default: React.FC = () => (
  <View sx={{ bwidth: "1", maxw: "272", p: "36" }}>
    <Type paragraph>
      I&apos;m a polymorphic component (default div) that accepts all styles via the sx prop!
    </Type>
  </View>
);
