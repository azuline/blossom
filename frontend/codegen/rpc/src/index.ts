export type RPCErrors = {
  UnauthorizedError: null;
  ServerJSONDeserializeError: {
    message: string;
  };
  DataMismatchError: {
    message: string;
  };
  InputValidationError: {
    message: string;
    fields: Record<string, unknown>;
  };
  InvalidCredentialsError: null;
  AuthTenantNotFoundError: null;
  // These are errors that the frontend RPC executor can raise.
  NetworkError: null;
  InternalServerError: null;
  RPCNotFoundError: null;
  ClientJSONDecodeError: null;
  UncaughtRPCError: null;
};

export type RPCSystemErrors =
  | "NetworkError"
  | "InternalServerError"
  | "RPCNotFoundError"
  | "ClientJSONDecodeError"
  | "UncaughtRPCError"
  | "UnauthorizedError"
  | "ServerJSONDeserializeError"
  | "DataMismatchError"
  | "InputValidationError";

export type RPCs = {
  Login: {
    in: {
      email: string;
      password: string;
      permanent: boolean;
      tenant_external_id: string | null;
    };
    out: null;
    errors:
      | "InvalidCredentialsError"
      | "AuthTenantNotFoundError";
  };
  Logout: {
    in: null;
    out: null;
    errors: never;
  };
  GetPageLoadInfo: {
    in: null;
    out: {
      external_id: string | null;
      name: string | null;
      email: string | null;
      tenant: {
        external_id: string;
        name: string;
      } | null;
      available_tenants: {
        external_id: string;
        name: string;
      }[];
    };
    errors: never;
  };
};

export const RPCMethods = {
  Login: "POST",
  Logout: "POST",
  GetPageLoadInfo: "GET",
} satisfies Record<keyof RPCs, "GET" | "POST">;
