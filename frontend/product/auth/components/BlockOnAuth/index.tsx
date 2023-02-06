import { AppLoader } from "@foundation/loaders/AppLoader";
import { useRPC } from "@foundation/rpc";
import { ReactNode } from "react";

// TODO: Think of a better router scheme such that this does not need to exist.
// Currently, this exists so that the router auth restrictions work as intended.

type Props = { children: ReactNode };

// BlockOnAuth blocks render until the initial auth endpoint has loaded.
export const BlockOnAuth: React.FC<Props> = props => {
  const { isLoading, error } = useRPC("GetPageLoadInfo", null);
  if (isLoading) {
    return <AppLoader />;
  }
  if (error) {
    throw error;
  }
  return <>{props.children}</>;
};
