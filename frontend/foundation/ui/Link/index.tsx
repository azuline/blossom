import { HeadlessLink } from "@foundation/routing/components/HeadlessLink";
import { SX } from "@foundation/style/sprinkles.css";
import { sLink } from "@foundation/ui/Link/index.css";
import clsx from "clsx";

type Props = {
  href: string;
  className?: string;
  sx?: SX;
  children?: React.ReactNode;
};

export const Link: React.FC<Props> = props => {
  return (
    <HeadlessLink
      className={clsx(props.className, sLink)}
      href={props.href}
      sx={{ display: "inline", ...props.sx }}
    >
      {props.children}
    </HeadlessLink>
  );
};
