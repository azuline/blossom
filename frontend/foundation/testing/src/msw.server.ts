import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";
import { mockRPCHandlers, RPCMocks } from "./msw.shared";

/**
 * These functions aren't exported from index.js because of
 * https://github.com/mswjs/msw/issues/1539. Import them from the full path instead
 * until that issue is fixed.
 */

/** This function allows for RPC mocking in a describe test suite. */
export const mockRPCsForSuite = (mocks: RPCMocks): void => {
  const server = setupServer(...mockRPCHandlers(mocks));
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
};

/** This function allows for RPC mocking in a single test case. */
export const mockRPCsForTest = async (mocks: RPCMocks, fn: () => Promise<void>): Promise<void> => {
  const server = setupServer(...mockRPCHandlers(mocks));
  server.listen();
  await fn();
  server.close();
};
