import { IconCheck } from "@foundation/icons/IconCheck";
import { SX } from "@foundation/style/sprinkles.css";
import { sCheckbox } from "@foundation/ui/Checkbox/index.css";
import { Flex } from "@foundation/ui/Flex";
import { Type } from "@foundation/ui/Type";
import { LabellableProps } from "@foundation/ui/types";
import { View } from "@foundation/ui/View";
import { useRef } from "react";
import { AriaCheckboxProps, useCheckbox, useFocusRing, VisuallyHidden } from "react-aria";
import { useToggleState } from "react-stately";

type Props = LabellableProps & {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  sx?: SX;
};

export const Checkbox: React.FC<Props> = props => {
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
    <Flex
      as="label"
      sx={{
        align: "center",
        gap: "8",
        cursor: props.disabled ? "not-allowed" : "pointer",
        ...props.sx,
      }}
    >
      <VisuallyHidden>
        <input {...inputProps} {...focusProps} ref={ref} />
      </VisuallyHidden>
      <View
        aria-hidden="true"
        className={sCheckbox({
          checked: props.checked,
          disabled: props.disabled,
          focused: isFocusVisible,
        })}
      >
        {props.checked && <IconCheck size="full" />}
      </View>
      {props.label !== undefined && (
        <Type sx={{ color: props.disabled ? "neutral.weak" : "neutral.default" }}>
          {props.label}
        </Type>
      )}
    </Flex>
  );
};
