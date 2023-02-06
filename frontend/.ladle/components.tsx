import type { GlobalProvider } from "@ladle/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const Provider: GlobalProvider = ({
  children,
}) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);
