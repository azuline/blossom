import { RPCErrors, RPCMethods, RPCs } from "@codegen/rpc";
import { baseURL } from "@foundation/rpc";
import { rest, RestHandler, setupWorker } from "msw";
import { afterAll, afterEach, beforeAll } from "vitest";

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


/** This function allows for RPC mocking in a describe test suite. */
export const mockRPCsForSuite = (mocks: RPCMocks): void => {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
    const { setupServer } = require('msw/node');
    const server = setupServer(...mockRPCHandlers(mocks));
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());
  }
};

/** This function allows for RPC mocking in a single test case. */
export const mockRPCsForTest = async (mocks: RPCMocks, fn: () => Promise<void>): Promise<void> => {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
    const { setupServer } = require('msw/node');
    const server = setupServer(...mockRPCHandlers(mocks));
    server.listen();
    await fn();
    server.close();
  }
};
