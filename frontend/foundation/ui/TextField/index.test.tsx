import { TextField, TextFieldProps } from "@foundation/ui/TextField";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FC, useState } from "react";

import { describe, expect, it } from "vitest";

const TestTextField: FC<Pick<TextFieldProps, "disabled">> = props => {
  const [value, setValue] = useState<string>("");
  return <TextField {...props} label="Label" value={value} onChange={setValue} />;
};

describe("@foundation/ui/TextField", () => {
  it("typing changes value", async () => {
    render(<TestTextField />);
    await screen.findByText("Label");
    await userEvent.type(screen.getByLabelText("Label"), "lah lah");
    expect(screen.getByLabelText("Label")).toHaveValue("lah lah");
  });

  it("typing in disabled field does not change value", async () => {
    render(<TestTextField disabled />);
    await screen.findByText("Label");
    await userEvent.type(screen.getByLabelText("Label"), "lah lah");
    expect(screen.getByLabelText("Label")).not.toHaveValue("lah lah");
  });
});
