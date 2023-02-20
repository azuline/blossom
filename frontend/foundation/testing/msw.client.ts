import { RPCMethods, RPCs } from "@codegen/rpc";
import { rest, RestHandler, setupWorker } from "msw";

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
