import { sHeadlessLink } from "@foundation/routing/components/HeadlessLink/index.css";
import { usePrefetchPath } from "@foundation/routing/state/prefetch";
import { SX, sx } from "@foundation/style/sprinkles.css";
import { clsx } from "clsx";
import { ReactNode, useEffect, useRef } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  sx?: SX;
};

export const HeadlessLink: React.FC<Props> = props => {
  const prefetchPath = usePrefetchPath();
  useEffect(() => prefetchPath(props.href), [prefetchPath, props.href]);

  const ref = useRef(null);
  return (
    <a
      ref={ref}
      className={clsx(sHeadlessLink, props.className, sx(props.sx ?? {}))}
      href={props.href}
    >
      {props.children}
    </a>
  );
};
