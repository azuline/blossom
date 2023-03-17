import { RPCErrors, RPCMethods, RPCs } from "@codegen/rpc";
import { baseURL } from "@foundation/rpc";
import { rest, RestHandler, setupWorker } from "msw";

type RPCErrorOut<RPC extends keyof RPCs, E extends RPCs[RPC]["errors"] = RPCs[RPC]["errors"]> = {
  error: E;
  data: RPCErrors[E];
};

export type RPCMockOut<RPC extends keyof RPCs> = {
  out: RPCs[RPC]["out"] | RPCErrorOut<RPC>;
  status: number;
};

export type RPCMocks = { [RPC in keyof RPCs]?: RPCMockOut<RPC> };

export const mockRPCsWorker = (mocks: RPCMocks): void => {
  const worker = setupWorker(...mockRPCHandlers(mocks));
  void worker.start({ onUnhandledRequest: "bypass" });
};

export const mockRPCHandlers = (mocks: RPCMocks): RestHandler[] => {
  return Object.entries(mocks).map(([name, out]) => {
    const method = RPCMethods[name as keyof RPCs].toLowerCase() as "get" | "post";
    return rest[method](
      `${baseURL}/api/${name}`,
      (_, res, ctx) => res(ctx.status(out.status), ctx.json(out.out)),
    );
  });
};
