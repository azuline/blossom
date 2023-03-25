import { mockRPCsForTest } from "@foundation/testing";
import { PageTestWrap } from "@foundation/testing";
import LoginPage from "@product/login/page";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, vi } from "vitest";

describe("@product/login", () => {
  it("login success", () =>
    mockRPCsForTest(
      { Login: { status: 200, out: null } },
      async () => {
        render(
          <PageTestWrap>
            <LoginPage />
          </PageTestWrap>,
        );
        const redirectSpy = vi.spyOn(window.history, "pushState");
        await screen.findByText("Welcome back!");
        await userEvent.type(screen.getByLabelText("Email"), "blissful@sunsetglow.net");
        await userEvent.type(screen.getByLabelText("Password"), "i love react");
        expect(redirectSpy).not.toHaveBeenCalled();
        await userEvent.click(screen.getByText("Sign in"));
        expect(redirectSpy).toHaveBeenCalled();
      },
    ));

  it("login failure", () =>
    mockRPCsForTest(
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
