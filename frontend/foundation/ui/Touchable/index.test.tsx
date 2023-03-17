import { Touchable, TouchableProps } from "@foundation/ui/Touchable";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FC, useState } from "react";

import { describe, expect, it } from "vitest";

const TestTouchable: FC<Pick<TouchableProps, "disabled">> = props => {
  const [count, setCount] = useState<number>(0);
  return <Touchable {...props} onPress={() => setCount(c => c + 1)}>{count}</Touchable>;
};

describe("@foundation/ui/Touchable", () => {
  it("onPress triggers callback", async () => {
    render(<TestTouchable />);
    await screen.findByRole("button");
    expect(screen.getByRole("button")).toHaveTextContent("0");
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("1");
  });

  it("onPress disabled does not trigger callback", async () => {
    render(<TestTouchable disabled />);
    await screen.findByRole("button");
    expect(screen.getByRole("button")).toHaveTextContent("0");
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("0");
  });
});
