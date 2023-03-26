import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FC, useState } from "react";
import { Checkbox, CheckboxProps } from ".";

import { describe, expect, it } from "vitest";

const TestCheckbox: FC<Pick<CheckboxProps, "disabled">> = props => {
  const [checked, setChecked] = useState<boolean>(false);
  return <Checkbox {...props} checked={checked} label="Remember me" onChange={setChecked} />;
};

describe("@foundation/ui", () => {
  const check = (): Promise<void> => userEvent.click(screen.getByRole("checkbox"));

  it("click toggles state", async () => {
    render(<TestCheckbox />);
    await screen.findByText("Remember me");
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    await check();
    expect(screen.getByRole("checkbox")).toBeChecked();
    await check();
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("click disabled does not toggle", async () => {
    render(<TestCheckbox disabled />);
    await screen.findByText("Remember me");
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    await check();
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });
});
