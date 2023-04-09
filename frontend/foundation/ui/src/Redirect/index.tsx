import { usePrefetchPath } from "@foundation/routing";
import { SX, sx } from "@foundation/theme";
import { clsx } from "clsx";
import { CSSProperties, ReactNode, useRef } from "react";

export type RedirectProps = {
  href: string;
  open?: "here" | "new-tab";

  /** Standard props. */
  children: ReactNode;
  className?: string;
  id?: string;
  sx?: SX;
  style?: CSSProperties;
};

export const Redirect: React.FC<RedirectProps> = props => {
  usePrefetchPath(props.href);
  const ref = useRef(null);
  return (
    <a
      ref={ref}
      className={clsx(props.className, sx({ cursor: "pointer", ...props.sx }))}
      href={props.href}
      id={props.id}
      rel="noreferrer"
      style={props.style}
      target={props.open === "new-tab" ? "_blank" : undefined}
      // We don't need this in normal operation; however, in tests, a normal redirect
      // doesn't really work.
      onClick={() => {
        window.history.pushState(null, "", props.href);
      }}
    >
      {props.children}
    </a>
  );
};
