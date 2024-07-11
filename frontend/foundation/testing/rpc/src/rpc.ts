import { RPCErrors, RPCMethods, RPCs } from "@codegen/rpc";
import { baseURL } from "@foundation/rpc";
import { http, HttpHandler, HttpResponse } from "msw";

type RPCErrorOut<RPC extends keyof RPCs, E extends RPCs[RPC]["errors"] = RPCs[RPC]["errors"]> = {
  error: E;
  data: RPCErrors[E];
};

export type RPCMockOut<RPC extends keyof RPCs> = {
  out: RPCs[RPC]["out"] | RPCErrorOut<RPC>;
  status: number;
};

export type RPCMocks = { [RPC in keyof RPCs]?: RPCMockOut<RPC> };

export const mockRPCHandlers = (mocks: RPCMocks): HttpHandler[] => {
  return Object.entries(mocks).map(([name, out]) => {
    const method = RPCMethods[name as keyof RPCs].toLowerCase() as "get" | "post";
    return http[method](
      `${baseURL}/api/${name}`,
      () => HttpResponse.json(out.out, { status: out.status }),
    );
  });
};

// All RPC endpoints must define a set of default mock data for stories and visual
// tests. These can also be used as mock data in unit and integration tests.
export const DEFAULT_MOCK_RPC_OUTPUT = {
  Login: { status: 200, out: null },
  Logout: { status: 200, out: null },
  GetPageLoadInfo: {
    status: 200,
    out: {
      external_id: "usr_abcdefg",
      name: "User name",
      email: "user@sunsetglow.net",
      tenant: { external_id: "ten_aaaaaaa", name: "Sunset Glow" },
      available_tenants: [
        { external_id: "ten_aaaaaaa", name: "Sunset Glow" },
        { external_id: "ten_bbbbbbb", name: "Flowing Fire" },
      ],
    },
  },
} satisfies { [RPC in keyof RPCs]: RPCMockOut<RPC> };
