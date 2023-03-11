import { InlineRoute } from "@foundation/routing/components/Route";
import { mockRPCsIn } from "@foundation/testing/msw.server";
import LoginPage from "@product/login/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FC, ReactNode } from "react";

import { describe, it } from "vitest";
import { Switch } from "wouter";

const queryClient = new QueryClient();

const PageTestWrap: FC<{ children: ReactNode }> = props => (
  <QueryClientProvider client={queryClient}>
    {props.children}
  </QueryClientProvider>
);

describe("@product/login", () => {
  it("login success", () =>
    mockRPCsIn(
      { Login: { status: 200, out: null } },
      async () => {
        render(
          <PageTestWrap>
            <InlineRoute page={<LoginPage />} path="/:any*" />
            {/* Hacky way to test that the redirect succeeded. */}
            <Switch>
              <InlineRoute page={<>Logged in!</>} path="/" />
            </Switch>
          </PageTestWrap>,
        );
        await screen.findByText("Welcome back!");
        await userEvent.type(screen.getByLabelText("Email"), "blissful@sunsetglow.net");
        await userEvent.type(screen.getByLabelText("Password"), "i love react");
        await userEvent.click(screen.getByText("Sign in"));
        await screen.findByText(/Logged in!/);
      },
    ));

  it("login failure", () =>
    mockRPCsIn(
      { Login: { status: 400, out: { error: "InvalidCredentialsError", data: null } } },
      async () => {
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
      },
    ));
});
