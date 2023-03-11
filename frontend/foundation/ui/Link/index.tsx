import { HeadlessLink, HeadlessLinkProps } from "@foundation/routing/components/HeadlessLink";
import { SX } from "@foundation/theme/styles/sprinkles.css";
import { sLink } from "@foundation/ui/Link/index.css";
import { RecipeVariants } from "@vanilla-extract/recipes";
import clsx from "clsx";

type Props = RecipeVariants<typeof sLink> & {
  href: HeadlessLinkProps["href"];
  open?: HeadlessLinkProps["open"];
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
    <HeadlessLink
      className={clsx(props.className, sLink({ variant: props.variant }))}
      href={props.href}
      open={props.open}
      sx={{ display: "inline", ...props.sx }}
    >
      {props.children}
    </HeadlessLink>
  );
};
