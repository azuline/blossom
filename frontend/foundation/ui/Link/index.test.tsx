import { Link } from "@foundation/ui/Link";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { describe, expect, it, vi } from "vitest";

describe("@foundation/ui/Redirect", () => {
  it("click triggers redirect", async () => {
    render(<Link href="/hi">hi</Link>);
    await screen.findByText("hi");
    const redirectSpy = vi.spyOn(window.history, "pushState");
    expect(redirectSpy).not.toHaveBeenCalled();
    await userEvent.click(screen.getByText("hi"));
    expect(redirectSpy).toHaveBeenCalled();
  });
});
