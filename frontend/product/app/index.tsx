import { LayoutPaddingVariableSetter } from "@foundation/layout/LayoutPaddingVariableSetter";
import { ThemeProvider } from "@foundation/theme/provider";
import "@foundation/theme/styles/global.css";
import { Contexts } from "@product/app/Contexts";
import { Router } from "@product/app/Router";

export const App: React.FC = () => (
  <ThemeProvider>
    <Contexts>
      <LayoutPaddingVariableSetter>
        <Router />
      </LayoutPaddingVariableSetter>
    </Contexts>
  </ThemeProvider>
);
