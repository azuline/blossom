import { GlobalProvider, useLadleContext } from "@ladle/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { mockRPCsWorker } from "@foundation/testing/msw.client";
import { DEFAULT_MOCK_RPC_OUTPUT } from "@foundation/testing/rpc";

import "@foundation/theme/styles/global.css";
import { ThemeProvider } from "@foundation/theme/provider";
import { Flex } from "@foundation/ui/Flex";

const queryClient = new QueryClient();

// Set up MSW with dummy endpoints.
mockRPCsWorker(DEFAULT_MOCK_RPC_OUTPUT);

export const Provider: GlobalProvider = ({ children }) => {
  const { globalState } = useLadleContext();
  const theme = globalState.theme === "light" || globalState.theme === "dark"
    ? globalState.theme
    : undefined;

  return (
    <ThemeProvider force={theme}>
      <Flex sx={{ h: "full", w: "full", direction: "column" }}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </Flex>
    </ThemeProvider>
  );
};
