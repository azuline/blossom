import { SX } from "@foundation/theme/styles/sprinkles.css";
import { sTouchable } from "@foundation/ui/Touchable/index.css";
import { clsx } from "clsx";
import { ReactNode, useRef } from "react";
import { AriaButtonProps, useButton } from "react-aria";

export type TouchableProps = {
  children: ReactNode;
  className?: string;
  sx?: SX;
  id?: string;
  disabled?: boolean;
  type?: AriaButtonProps["type"];
  "aria-haspopup"?: AriaButtonProps["aria-haspopup"];
  onPress?: (() => void) | (() => Promise<void>);
};

export const Touchable: React.FC<TouchableProps> = props => {
  const ref = useRef(null);

  const ariaProps: AriaButtonProps = {
    ...props,
    isDisabled: props.disabled,
    // This is an undocumented property.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    preventFocusOnPress: true,
  };
  const { buttonProps, isPressed } = useButton(ariaProps, ref);

  return (
    // The `type` prop is a part of buttonProps.
    // eslint-disable-next-line react/button-has-type
    <button
      ref={ref}
      className={clsx(sTouchable, props.className, isPressed && "pressed")}
      id={props.id}
      {...(buttonProps as Record<string, unknown>)}
    >
      {props.children}
    </button>
  );
};
