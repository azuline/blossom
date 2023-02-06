import { BlockOnAuth } from "@product/auth/components/BlockOnAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

type Props = { children: ReactNode };

const queryClient = new QueryClient();

export const Contexts: React.FC<Props> = props => (
  <QueryClientProvider client={queryClient}>
    <BlockOnAuth>
      {props.children}
    </BlockOnAuth>
  </QueryClientProvider>
);
