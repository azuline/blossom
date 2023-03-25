import { Redirect } from "@foundation/ui/Redirect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { describe, expect, it, vi } from "vitest";

describe("@foundation/ui/Redirect", () => {
  it("click triggers redirect", async () => {
    render(<Redirect href="/hi">hi</Redirect>);
    const redirectSpy = vi.spyOn(window.history, "pushState");
    await screen.findByText("hi");
    expect(redirectSpy).not.toHaveBeenCalled();
    await userEvent.click(screen.getByText("hi"));
    expect(redirectSpy).toHaveBeenCalled();
  });
});
