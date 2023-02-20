import { RPCs } from "@codegen/rpc";

// All RPC endpoints must define a set of default mock data for stories and visual
// tests. These can also be used as mock data in unit and integration tests.
export const DEFAULT_MOCK_RPC_OUTPUT = {
  Login: null,
  Logout: null,
  GetPageLoadInfo: {
    external_id: "usr_abcdefg",
    name: "User name",
    email: "user@sunsetglow.net",
    tenant: { external_id: "ten_aaaaaaa", name: "Sunset Glow" },
    available_tenants: [
      { external_id: "ten_aaaaaaa", name: "Sunset Glow" },
      { external_id: "ten_bbbbbbb", name: "Flowing Fire" },
    ],
  },
} satisfies { [k in keyof RPCs]: RPCs[k]["out"] };
