import { RPCMethods, RPCs } from "@codegen/rpc";
import { rest, RestHandler, setupWorker } from "msw";

// All RPC endpoints must define a set of default mock data for stories and visual
// tests. These can also be used as mock data in unit and integration tests.
export const DEFAULT_MOCK_RPC_OUTPUT = {
  Login: null,
  Logout: null,
  GetPageLoadInfo: {
    external_id: "usr_abcdefg",
    name: "User name",
    email: "user@sunsetglow.net",
    available_tenants: [
      { external_id: "ten_aaaaaaa", name: "Sunset Glow" },
      { external_id: "ten_bbbbbbb", name: "Flowing Fire" },
    ],
  },
} satisfies { [k in keyof RPCs]: RPCs[k]["out"] };

export type RPCMocks = { [k in keyof RPCs]?: RPCs[k]["out"] };

export const mockRPCsWorker = (mocks: RPCMocks): void => {
  const worker = setupWorker(...mockRPCHandlers(mocks));
  void worker.start();
};

export const mockRPCHandlers = (mocks: RPCMocks): RestHandler[] => {
  return Object.entries(mocks).map(([name, out]) => {
    const method = RPCMethods[name as keyof RPCs].toLowerCase() as "get" | "post";
    return rest[method](`/api/${name}`, (_, res, ctx) => res(ctx.json(out)));
  });
};
