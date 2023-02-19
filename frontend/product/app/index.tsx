import { View } from "@foundation/ui/View";
import { Contexts } from "@product/app/Contexts";
import { Router } from "@product/app/Router";
import "@foundation/style/global.css";

export const App: React.FC = () => (
  <View sx={{ h: "full", bg: "neutral.default", col: "neutral.default" }}>
    <Contexts>
      <Router />
    </Contexts>
  </View>
);
