import { mockRPCs } from "@foundation/testing/msw.server";
import LoginPage from "@product/login/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FC, ReactNode } from "react";

import { describe, it } from "vitest";

const queryClient = new QueryClient();

const PageTestWrap: FC<{ children: ReactNode }> = props => (
  <QueryClientProvider client={queryClient}>
    {props.children}
  </QueryClientProvider>
);

describe("@product/login", () => {
  mockRPCs({ Login: { status: 400, out: { error: "InvalidCredentialsError", data: null } } });
  it("login failure", async () => {
    render(
      <PageTestWrap>
        <LoginPage />
      </PageTestWrap>,
    );
    await screen.findByText("Welcome back!");
    await userEvent.type(screen.getByLabelText("Email"), "blissful@sunsetglow.net");
    await userEvent.type(screen.getByLabelText("Password"), "i love react");
    await userEvent.click(screen.getByText("Sign in"));
    await screen.findByText(/Invalid login credentials\./);
  });
});
