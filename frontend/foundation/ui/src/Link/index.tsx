import { SX } from "@foundation/theme";
import { RecipeVariants } from "@vanilla-extract/recipes";
import clsx from "clsx";
import { Redirect, RedirectProps } from "../Redirect";
import { sLink } from "./index.css";

type Props = RecipeVariants<typeof sLink> & {
  href: RedirectProps["href"];
  open?: RedirectProps["open"];
  className?: string;
  sx?: SX;
  children?: React.ReactNode;
};

export const Link: React.FC<Props> = _props => {
  const props = {
    ..._props,
    variant: _props.variant ?? "primary",
  };

  return (
    <Redirect
      className={clsx(props.className, sLink({ variant: props.variant }))}
      href={props.href}
      open={props.open}
      sx={{ display: "inline", ...props.sx }}
    >
      {props.children}
    </Redirect>
  );
};
