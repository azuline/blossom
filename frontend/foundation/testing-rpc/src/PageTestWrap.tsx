import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { FC, ReactNode } from "react";

const queryClient = new QueryClient();

export const PageTestWrap: FC<{ children: ReactNode }> = props => (
  <QueryClientProvider client={queryClient}>
    {props.children}
  </QueryClientProvider>
);
