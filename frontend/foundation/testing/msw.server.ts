import { mockRPCHandlers, RPCMocks } from "@foundation/testing/msw.client";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";

export const mockRPCs = (mocks: RPCMocks): void => {
  const server = setupServer(...mockRPCHandlers(mocks));
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
};
