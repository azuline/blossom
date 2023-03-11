import { LayoutPaddingVariableSetter } from "@foundation/layout/LayoutPaddingVariableSetter";
import "@foundation/theme/styles/global.css";
import { themeMoonlightLightClass } from "@foundation/theme/themes/color.css";
import { View } from "@foundation/ui/View";
import { Contexts } from "@product/app/Contexts";
import { Router } from "@product/app/Router";

export const App: React.FC = () => (
  <View
    className={themeMoonlightLightClass}
    sx={{ h: "full", background: "neutral.base", color: "neutral.default" }}
  >
    <Contexts>
      <LayoutPaddingVariableSetter>
        <Router />
      </LayoutPaddingVariableSetter>
    </Contexts>
  </View>
);
