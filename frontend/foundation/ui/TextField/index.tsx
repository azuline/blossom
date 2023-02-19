import { Flex } from "@foundation/ui/Flex";
import { AriaTextFieldProps, useTextField } from "react-aria";

import { View } from "@foundation/ui/View";

import { sTextField } from "@foundation/ui/TextField/index.css";
import { Type } from "@foundation/ui/Type";
import { LabellableProps } from "@foundation/ui/types";
import { FocusEvent, useRef } from "react";

type Props = LabellableProps & {
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

export const TextField: React.FC<Props> = props => {
  const ref = useRef(null);

  const ariaProps: AriaTextFieldProps = { ...props, isDisabled: props.disabled };
  const { labelProps, inputProps, errorMessageProps } = useTextField(ariaProps, ref);

  return (
    <Flex sx={{ dir: "column", gap: "6" }}>
      {props.label !== undefined && (
        <Type as="label" sx={{ text: "md", col: "neutral.default" }} {...labelProps}>
          {props.label}
        </Type>
      )}
      <View
        as="input"
        className={sTextField({
          disabled: props.disabled,
          error: props.errorMessage !== undefined,
        })}
        {...inputProps}
      />
      {props.errorMessage !== undefined && (
        <Type sx={{ text: "md", col: "negative.default" }} {...errorMessageProps}>
          {props.errorMessage}
        </Type>
      )}
    </Flex>
  );
};
