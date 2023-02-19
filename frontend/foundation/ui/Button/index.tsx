import { ReactNode, useRef } from "react";

import { SX } from "@foundation/style/sprinkles.css";
import { sButton } from "@foundation/ui/Button/index.css";
import { Center } from "@foundation/ui/Center";
import { RecipeVariants } from "@vanilla-extract/recipes";
import { AriaButtonProps, useButton } from "react-aria";

type Props = Exclude<RecipeVariants<typeof sButton>, "disabled"> & {
  children: ReactNode;
  onPress: (() => void) | (() => Promise<void>);
  disabled?: boolean;
  type?: AriaButtonProps["type"];
  "aria-haspopup"?: AriaButtonProps["aria-haspopup"];
  id?: string;
  sx?: SX;
};

export const Button: React.FC<Props> = props => {
  const ref = useRef(null);

  const ariaProps: AriaButtonProps = { ...props, isDisabled: props.disabled };
  const { buttonProps } = useButton(ariaProps, ref);

  return (
    // The button type is a part of buttonProps.
    // eslint-disable-next-line react/button-has-type
    <button
      ref={ref}
      className={sButton({
        variant: props.variant,
        disabled: props.disabled,
        size: props.size,
        fullWidth: props.fullWidth,
      })}
      {...buttonProps}
    >
      {/* Open a stacking context so the content is always on top of the hover overlay. */}
      <Center sx={{ w: "full", h: "full", isolation: "isolate" }}>
        {props.children}
      </Center>
    </button>
  );
};
