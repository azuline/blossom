import { Flex } from "@foundation/ui/Flex";
import { AriaTextFieldProps, useTextField } from "react-aria";

import { sTextField } from "@foundation/ui/TextField/index.css";
import { Type } from "@foundation/ui/Type";
import { LabellableProps } from "@foundation/ui/types";
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

export const TextField: React.FC<TextFieldProps> = props => {
  const ref = useRef(null);

  const ariaProps: AriaTextFieldProps = { ...props, isDisabled: props.disabled };
  const { labelProps, inputProps, errorMessageProps } = useTextField(ariaProps, ref);

  return (
    <Flex sx={{ direction: "column", gap: "8" }}>
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
        <Type sx={{ color: "negative.default" }} variant="xs" {...errorMessageProps}>
          {props.errorMessage}
        </Type>
      )}
    </Flex>
  );
};
