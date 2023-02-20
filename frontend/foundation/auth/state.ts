import { RPCs } from "@codegen/rpc";
import { currentTenantIDAtom } from "@foundation/auth/components/BlockOnAuth";
import { useRPC } from "@foundation/rpc";
import { useAtom } from "jotai";

type CurrentUser = Omit<RPCs["GetPageLoadInfo"]["out"], "available_tenants">;

export const useCurrentUser = (): CurrentUser | undefined => {
  const { data } = useRPC("GetPageLoadInfo", null);
  return data;
};

type CurrentTenant = RPCs["GetPageLoadInfo"]["out"]["available_tenants"][number];

export const useCurrentTenant = (): CurrentTenant | undefined => {
  const { data } = useRPC("GetPageLoadInfo", null);
  const [currentTenantID] = useAtom(currentTenantIDAtom);
  return data?.available_tenants.find(x => x.external_id === currentTenantID);
};
