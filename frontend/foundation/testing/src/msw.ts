import { setupWorker } from "msw";
import { mockRPCHandlers, RPCMocks } from "./msw.shared";

export const mockRPCsWorker = (mocks: RPCMocks): void => {
  const worker = setupWorker(...mockRPCHandlers(mocks));
  void worker.start({ onUnhandledRequest: "bypass" });
};

/** This function allows for RPC mocking in a describe test suite. */
export const mockRPCsForSuite = (mocks: RPCMocks): void => {
  if (typeof process !== "undefined") {
    // eslint-disable-next-line
    const { mockRPCsForSuite } = require("./msw.server");
    // eslint-disable-next-line
    mockRPCsForSuite(mocks);
  }
};

/** This function allows for RPC mocking in a single test case. */
export const mockRPCsForTest = async (mocks: RPCMocks, fn: () => Promise<void>): Promise<void> => {
  if (typeof process !== "undefined") {
    // eslint-disable-next-line
    const { mockRPCsForTest } = require("./msw.server");
    // eslint-disable-next-line
    await mockRPCsForTest(mocks, fn);
  }
};
