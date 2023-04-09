import { setupWorker } from "msw";
import { mockRPCHandlers, RPCMocks } from "./msw.shared";

export const mockRPCsWorker = (mocks: RPCMocks): void => {
  const worker = setupWorker(...mockRPCHandlers(mocks));
  void worker.start({ onUnhandledRequest: "bypass" });
};
