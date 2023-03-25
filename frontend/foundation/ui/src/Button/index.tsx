import { sButton } from "@foundation/ui/Button/index.css";
import { Center } from "@foundation/ui";
import { Redirect, RedirectProps } from "@foundation/ui";
import { Touchable, TouchableProps } from "@foundation/ui";
import { RecipeVariants } from "@vanilla-extract/recipes";
import clsx from "clsx";

export type ButtonProps =
  & RecipeVariants<typeof sButton>
  & (
    | ({ as: "a" } & RedirectProps)
    | ({ as?: undefined } & TouchableProps)
  );

export const Button: React.FC<ButtonProps> = props => {
  const sty = sButton({
    variant: props.variant,
    disabled: props.disabled,
    size: props.size,
    fullWidth: props.fullWidth,
  });

  if ("as" in props && props.as === "a") {
    return (
      <Redirect {...props} className={clsx(sty, props.className)}>
        {/* Open a stacking context so the content is always on top of the hover overlay. */}
        <Center sx={{ isolation: "isolate" }}>
          {props.children}
        </Center>
      </Redirect>
    );
  }

  return (
    <Touchable {...(props as TouchableProps)} className={clsx(sty, props.className)}>
      {/* Open a stacking context so the content is always on top of the hover overlay. */}
      <Center sx={{ isolation: "isolate" }}>
        {props.children}
      </Center>
    </Touchable>
  );
};
