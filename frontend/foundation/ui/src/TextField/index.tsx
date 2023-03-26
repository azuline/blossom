import { AriaTextFieldProps, useTextField } from "react-aria";

import { LabellableProps } from "../types";
import { Stack } from "../Stack";
import { Type } from "../Type";
import { sTextField } from './index.css';
import { FocusEvent, useRef } from "react";

export type TextFieldProps = LabellableProps & {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  errorMessage?: string;
  autoFocus?: boolean;
  onBlur?: (e: FocusEvent) => void;
  type?: "text" | "search" | "url" | "tel" | "email" | "password";
  id?: string;
  className?: string;
};

export const TextField: React.FC<TextFieldProps> = _props => {
  const props = {
    ..._props,
    disabled: _props.disabled ?? false,
  };

  const ref = useRef(null);

  const ariaProps: AriaTextFieldProps = { ...props, isDisabled: props.disabled };
  const { labelProps, inputProps, errorMessageProps } = useTextField(ariaProps, ref);

  return (
    <Stack axis="y" gap="8">
      {props.label !== undefined && (
        <Type as="label" sx={{ color: "neutral.default" }} variant="xs" {...labelProps}>
          {props.label}
        </Type>
      )}
      <input
        className={sTextField({
          disabled: props.disabled,
          error: props.errorMessage !== undefined,
        })}
        {...inputProps}
      />
      {props.errorMessage !== undefined && (
        <Type paragraph sx={{ color: "negative.default" }} variant="xs" {...errorMessageProps}>
          {props.errorMessage}
        </Type>
      )}
    </Stack>
  );
};
