import { LayoutPaddingVariableSetter } from "@foundation/layout";
import { ThemeProvider } from "@foundation/theme";
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
