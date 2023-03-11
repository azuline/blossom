import { mockRPCHandlers, RPCMocks } from "@foundation/testing/msw.client";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";

/** This function allows for RPC mocking in a describe test suite. */
export const mockRPCsHook = (mocks: RPCMocks): void => {
  const server = setupServer(...mockRPCHandlers(mocks));
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
};

/** This function allows for RPC mocking in a single test case. */
export const mockRPCsIn = async (mocks: RPCMocks, fn: () => Promise<void>): Promise<void> => {
  const server = setupServer(...mockRPCHandlers(mocks));
  server.listen();
  await fn();
  server.close();
};
