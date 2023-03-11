import { RPCs } from "@codegen/rpc";
import { RPCMockOut } from "@foundation/testing/msw.client";

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
