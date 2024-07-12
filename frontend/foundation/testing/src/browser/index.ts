import { setupWorker } from "msw/browser";
import { mockRPCHandlers, RPCMocks } from "../rpc";

export const mockRPCsWorker = (mocks: RPCMocks): void => {
  const worker = setupWorker(...mockRPCHandlers(mocks));
  void worker.start({ onUnhandledRequest: "bypass" });
};
