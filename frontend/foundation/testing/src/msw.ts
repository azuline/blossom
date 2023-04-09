import { setupWorker } from "msw";
import { mockRPCHandlers, RPCMocks } from "./msw.shared";

export const mockRPCsWorker = (mocks: RPCMocks): void => {
  const worker = setupWorker(...mockRPCHandlers(mocks));
  void worker.start({ onUnhandledRequest: "bypass" });
};

/** This function allows for RPC mocking in a describe test suite. */
export const mockRPCsForSuite = async (mocks: RPCMocks): Promise<void> => {
  if (typeof process !== "undefined") {
    const srv = await import("./msw.server");
    srv.mockRPCsForSuite(mocks);
  }
};

/** This function allows for RPC mocking in a single test case. */
export const mockRPCsForTest = async (mocks: RPCMocks, fn: () => Promise<void>): Promise<void> => {
  if (typeof process !== "undefined") {
    const srv = await import("./msw.server");
    await srv.mockRPCsForTest(mocks, fn);
  }
};
