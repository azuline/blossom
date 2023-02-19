import type { GlobalProvider } from "@ladle/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@foundation/style/global.css";

const queryClient = new QueryClient();

export const Provider: GlobalProvider = ({
  children,
}) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);
