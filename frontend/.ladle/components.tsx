import type { GlobalProvider } from "@ladle/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";

import { LayoutPaddingVariableSetter } from "../foundation/layout/LayoutPadding";
import { DEFAULT_MOCK_RPC_OUTPUT, mockRPCs } from "../foundation/testing/msw";

import "../foundation/style/global.css";

const queryClient = new QueryClient();

// Set up MSW with dummy endpoints.
const server = mockRPCs(DEFAULT_MOCK_RPC_OUTPUT);
server.start();

export const Provider: GlobalProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <LayoutPaddingVariableSetter>
        {children}
      </LayoutPaddingVariableSetter>
    </QueryClientProvider>
  );
};
