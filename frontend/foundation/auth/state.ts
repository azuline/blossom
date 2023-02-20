import { RPCs } from "@codegen/rpc";
import { useRPC } from "@foundation/rpc";

type CurrentUser = Omit<RPCs["GetPageLoadInfo"]["out"], "available_tenants">;

export const useCurrentUser = (): CurrentUser | undefined => {
  const { data } = useRPC("GetPageLoadInfo", null);
  if (data?.external_id == null) {
    return undefined;
  }
  return data;
};

type CurrentTenant = RPCs["GetPageLoadInfo"]["out"]["available_tenants"][number];

export const useCurrentTenant = (): CurrentTenant | undefined => {
  const { data } = useRPC("GetPageLoadInfo", null);
  return data?.tenant ?? undefined;
};
