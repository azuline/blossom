import { Icon } from "@foundation/icons/Icon";
import { SX, sx } from "@foundation/theme/styles/sprinkles.css";
import {
  sCheckboxBox,
  sCheckboxLayout,
} from "@foundation/ui/Checkbox/index.css";
import { Type } from "@foundation/ui/Type";
import { LabellableProps } from "@foundation/ui/types";
import { View } from "@foundation/ui/View";
import clsx from "clsx";
import { useId, useRef } from "react";
import { AriaCheckboxProps, useCheckbox, useFocusRing, VisuallyHidden } from "react-aria";
import { useToggleState } from "react-stately";

export type CheckboxProps = LabellableProps & {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  error?: boolean;
  disabled?: boolean;
  id?: string;
  sx?: SX;
};

export const Checkbox: React.FC<CheckboxProps> = _props => {
  const props = {
    ..._props,
    disabled: _props.disabled ?? false,
    error: _props.error ?? false,
  };

  const id = useId();
  const ref = useRef(null);

  const ariaProps: AriaCheckboxProps = {
    ...props,
    children: props.label,
    isSelected: props.checked,
    isDisabled: props.disabled,
  };
  const state = useToggleState(ariaProps);
  const { inputProps } = useCheckbox(ariaProps, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <label
      className={clsx(
        sCheckboxLayout,
        sx({ cursor: props.disabled ? "not-allowed" : "pointer", ...props.sx }),
      )}
      htmlFor={id}
    >
      <VisuallyHidden>
        <input id={id} {...inputProps} {...focusProps} ref={ref} />
      </VisuallyHidden>
      <View
        aria-hidden="true"
        className={clsx(
          sCheckboxBox({
            checked: props.checked,
            disabled: props.disabled,
            error: props.error,
            focused: isFocusVisible,
          }),
        )}
      >
        {props.checked && <Icon icon="check" size="full" />}
      </View>
      {props.label !== undefined && (
        <Type sx={{ color: props.disabled ? "neutral.weak" : "neutral.default" }} variant="xs">
          {props.label}
        </Type>
      )}
    </label>
  );
};
