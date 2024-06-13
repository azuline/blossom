import { GlobalProvider, ThemeState, useLadleContext } from "@ladle/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { DEFAULT_MOCK_RPC_OUTPUT, mockRPCsWorker } from "@foundation/testing";

import { LayoutPaddingVariableSetter } from "@foundation/layout";
import { ThemeProvider } from "@foundation/theme";
import { View } from "@foundation/ui";

const queryClient = new QueryClient();

// Set up MSW with dummy endpoints.
mockRPCsWorker(DEFAULT_MOCK_RPC_OUTPUT);

export const Provider: GlobalProvider = ({ children }) => {
  const { globalState } = useLadleContext();
  const theme = globalState.theme === ThemeState.Light || globalState.theme === ThemeState.Dark
    ? globalState.theme
    : undefined;

  return (
    <ThemeProvider force={theme}>
      <LayoutPaddingVariableSetter>
        <View sx={{ display: "flex", h: "full", w: "full", direction: "column" }}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </View>
      </LayoutPaddingVariableSetter>
    </ThemeProvider>
  );
};
