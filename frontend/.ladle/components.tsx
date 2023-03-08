import type { GlobalProvider } from "@ladle/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { LayoutPaddingVariableSetter } from "../foundation/layout/LayoutPadding";
import { StoryLayout } from "../foundation/stories/StoryLayout";
import { mockRPCsWorker } from "../foundation/testing/msw.client";
import { DEFAULT_MOCK_RPC_OUTPUT } from "../foundation/testing/rpc";

import "../foundation/style/global.css";

const queryClient = new QueryClient();

// Set up MSW with dummy endpoints.
mockRPCsWorker(DEFAULT_MOCK_RPC_OUTPUT);

export const Provider: GlobalProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <LayoutPaddingVariableSetter>
        <StoryLayout>
          {children}
        </StoryLayout>
      </LayoutPaddingVariableSetter>
    </QueryClientProvider>
  );
};
