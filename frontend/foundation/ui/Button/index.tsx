import { ReactNode, useRef } from "react";

import { usePrefetchPath } from "@foundation/routing/state/prefetch";
import { SX } from "@foundation/style/sprinkles.css";
import { sButton } from "@foundation/ui/Button/index.css";
import { Center } from "@foundation/ui/Center";
import { RecipeVariants } from "@vanilla-extract/recipes";
import { AriaButtonProps, useButton } from "react-aria";

type Props =
  & Exclude<RecipeVariants<typeof sButton>, "disabled">
  & {
    children: ReactNode;
    disabled?: boolean;
    type?: AriaButtonProps["type"];
    "aria-haspopup"?: AriaButtonProps["aria-haspopup"];
    id?: string;
    sx?: SX;
  }
  & ({
    onPress: (() => void) | (() => Promise<void>);
    href?: undefined;
    open?: undefined;
  } | {
    onPress?: undefined;
    href: string;
    open?: "here" | "new-tab";
  });

export const Button: React.FC<Props> = props => {
  usePrefetchPath(props.href);

  const ref = useRef(null);

  const ariaProps: AriaButtonProps = {
    ...props,
    isDisabled: props.disabled,
    // This is an undocumented property.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    preventFocusOnPress: true,
  };
  const { buttonProps } = useButton(ariaProps, ref);

  const Element = props.href !== undefined ? "a" : "button";

  return (
    // The button type is a part of buttonProps.
    // eslint-disable-next-line react/button-has-type
    <Element
      ref={ref}
      className={sButton({
        variant: props.variant,
        disabled: props.disabled,
        size: props.size,
        fullWidth: props.fullWidth,
      })}
      href={props.href}
      rel="noreferrer"
      target={props.open === "new-tab" ? "_blank" : undefined}
      {...(buttonProps as Record<string, unknown>)}
    >
      {/* Open a stacking context so the content is always on top of the hover overlay. */}
      <Center sx={{ w: "full", h: "full", isolation: "isolate" }}>
        {props.children}
      </Center>
    </Element>
  );
};
