import { LayoutPaddingVariableSetter } from "@foundation/layout";
import { ThemeProvider } from "@foundation/theme";
import { Contexts } from "./Contexts";
import { Router } from "./Router";

export const App: React.FC = () => (
  <ThemeProvider>
    <Contexts>
      <LayoutPaddingVariableSetter>
        <Router />
      </LayoutPaddingVariableSetter>
    </Contexts>
  </ThemeProvider>
);
