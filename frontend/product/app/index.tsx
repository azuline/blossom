import { View } from "@foundation/ui/View";
import { Contexts } from "@product/app/Contexts";
import { Router } from "@product/app/Router";

export const App: React.FC = () => (
  <View sx={{ h: "full", bg: "app", col: "neutral.1" }}>
    <Contexts>
      <Router />
    </Contexts>
  </View>
);
