import { SX, sx } from "@foundation/theme/styles/sprinkles.css";
import { sTouchable } from "@foundation/ui/Touchable/index.css";
import { clsx } from "clsx";
import { CSSProperties, ReactNode, useRef } from "react";
import { AriaButtonProps, useButton } from "react-aria";

export type TouchableProps = {
  disabled?: boolean;
  type?: AriaButtonProps["type"];
  "aria-haspopup"?: AriaButtonProps["aria-haspopup"];
  onPress?: (() => void) | (() => Promise<void>);

  /* Standard props. */
  children: ReactNode;
  className?: string;
  sx?: SX;
  id?: string;
  style?: CSSProperties;
};

export const Touchable: React.FC<TouchableProps> = props => {
  const ref = useRef(null);

  const ariaProps: AriaButtonProps = {
    ...props,
    isDisabled: props.disabled,
    // @ts-expect-error This is an undocumented property.
    preventFocusOnPress: true,
  };
  const { buttonProps, isPressed } = useButton(ariaProps, ref);

  return (
    // The `type` prop is a part of buttonProps.
    // eslint-disable-next-line react/button-has-type
    <button
      ref={ref}
      className={clsx(sTouchable, props.className, isPressed && "pressed", sx(props.sx ?? {}))}
      id={props.id}
      style={props.style}
      {...(buttonProps as Record<string, unknown>)}
    >
      {props.children}
    </button>
  );
};
