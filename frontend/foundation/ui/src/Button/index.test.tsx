import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FC, useState } from "react";
import { Button, ButtonProps } from ".";

import { describe, expect, it } from "vitest";

const TestButton: FC<Pick<ButtonProps, "disabled">> = props => {
  const [count, setCount] = useState<number>(0);
  return <Button {...props} onPress={() => setCount(c => c + 1)}>{count}</Button>;
};

describe("@foundation/ui", () => {
  it("onPress triggers callback", async () => {
    render(<TestButton />);
    await screen.findByRole("button");
    expect(screen.getByRole("button")).toHaveTextContent("0");
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("1");
  });

  it("onPress disabled does not trigger callback", async () => {
    render(<TestButton disabled />);
    await screen.findByRole("button");
    expect(screen.getByRole("button")).toHaveTextContent("0");
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("0");
  });
});
