import type { GlobalProvider } from "@ladle/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../foundation/style/global.css";
import { LayoutPaddingVariableSetter } from "../foundation/layout/LayoutPadding";

const queryClient = new QueryClient();

export const Provider: GlobalProvider = ({
  children,
}) => (
  <QueryClientProvider client={queryClient}>
    <LayoutPaddingVariableSetter>
      {children}
    </LayoutPaddingVariableSetter>
  </QueryClientProvider>
);
