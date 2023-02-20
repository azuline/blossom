import { AppLoader } from "@foundation/loaders/AppLoader";
import { useRPC } from "@foundation/rpc";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { ReactNode } from "react";

// TODO: Think of a better router scheme such that this does not need to exist.
// Currently, this exists so that the router auth restrictions work as intended.

export const currentTenantIDAtom = atomWithStorage<string | null>("currentTenantID", null);

type Props = { children: ReactNode };

// BlockOnAuth blocks render until the initial auth endpoint has loaded.
export const BlockOnAuth: React.FC<Props> = props => {
  const [currentTenantID, setCurrentTenantID] = useAtom(currentTenantIDAtom);

  const { data, status } = useRPC("GetPageLoadInfo", null);
  if (status === "loading") {
    return <AppLoader />;
  }

  // If there is no tenant selected, but the logged in user has tenants, we default to
  // the first tenant in the returned array. If this default is used, the default is
  // then selected as the active tenant.
  if (currentTenantID === null) {
    const tenant = data?.available_tenants[0];
    if (tenant !== undefined) {
      setCurrentTenantID(tenant.external_id);
      // Abort render and start a new re-render with currentTenantID set.
      return null;
    }
  }

  return <>{props.children}</>;
};
