import { mockRPCHandlers, RPCMocks } from "@foundation/testing-rpc";
import { setupWorker } from "msw/browser";

export const mockRPCsWorker = (mocks: RPCMocks): void => {
  const worker = setupWorker(...mockRPCHandlers(mocks));
  void worker.start({ onUnhandledRequest: "bypass" });
};
