import type { GlobalProvider } from "@ladle/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { mockRPCsWorker } from "@foundation/testing/msw.client";
import { DEFAULT_MOCK_RPC_OUTPUT } from "@foundation/testing/rpc";
import { themeMoonlightLightClass } from "@foundation/theme/themes/color.css";

import "@foundation/theme/styles/global.css";
import { Flex } from "@foundation/ui/Flex";

const queryClient = new QueryClient();

// Set up MSW with dummy endpoints.
mockRPCsWorker(DEFAULT_MOCK_RPC_OUTPUT);

export const Provider: GlobalProvider = ({ children }) => {
  return (
    <Flex
      className={themeMoonlightLightClass}
      sx={{ h: "full", w: "full", direction: "column" }}
    >
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Flex>
  );
};
