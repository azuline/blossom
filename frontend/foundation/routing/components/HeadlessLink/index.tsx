import { usePrefetchPath } from "@foundation/routing/state/prefetch";
import { SX, sx } from "@foundation/theme/styles/sprinkles.css";
import { clsx } from "clsx";
import { ReactNode, useRef } from "react";

export type HeadlessLinkProps = {
  href: string;
  open?: "here" | "new-tab";
  children: ReactNode;
  className?: string;
  sx?: SX;
};

export const HeadlessLink: React.FC<HeadlessLinkProps> = props => {
  usePrefetchPath(props.href);
  const ref = useRef(null);
  return (
    <a
      ref={ref}
      className={clsx(props.className, sx({ cursor: "pointer", ...props.sx }))}
      href={props.href}
      rel="noreferrer"
      target={props.open === "new-tab" ? "_blank" : undefined}
    >
      {props.children}
    </a>
  );
};
