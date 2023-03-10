import { LayoutPaddingVariableSetter } from "@foundation/layout/LayoutPaddingVariableSetter";
import "@foundation/style/global.css";
import { View } from "@foundation/ui/View";
import { Contexts } from "@product/app/Contexts";
import { Router } from "@product/app/Router";

export const App: React.FC = () => (
  <View sx={{ h: "full", background: "neutral.base", color: "neutral.default" }}>
    <Contexts>
      <LayoutPaddingVariableSetter>
        <Router />
      </LayoutPaddingVariableSetter>
    </Contexts>
  </View>
);
