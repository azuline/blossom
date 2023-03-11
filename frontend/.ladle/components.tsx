import type { GlobalProvider } from "@ladle/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { mockRPCsWorker } from "../foundation/testing/msw.client";
import { DEFAULT_MOCK_RPC_OUTPUT } from "../foundation/testing/rpc";

import "../foundation/theme/styles/global.css";

const queryClient = new QueryClient();

// Set up MSW with dummy endpoints.
mockRPCsWorker(DEFAULT_MOCK_RPC_OUTPUT);

export const Provider: GlobalProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
