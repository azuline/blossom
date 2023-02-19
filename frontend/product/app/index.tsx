import { View } from "@foundation/ui/View";
import { Contexts } from "@product/app/Contexts";
import { Router } from "@product/app/Router";
import "@foundation/style/global.css";
import { LayoutPaddingVariableSetter } from "@foundation/layout/LayoutPadding";

export const App: React.FC = () => (
  <View sx={{ h: "full", bg: "neutral.default", col: "neutral.default" }}>
    <Contexts>
      <LayoutPaddingVariableSetter>
        <Router />
      </LayoutPaddingVariableSetter>
    </Contexts>
  </View>
);
