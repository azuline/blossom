import { sHeadlessLink } from "@foundation/routing/components/HeadlessLink/index.css";
import { usePrefetchPath } from "@foundation/routing/state/prefetch";
import { SX } from "@foundation/style/sprinkles.css";
import { View } from "@foundation/ui/View";
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
    <View
      ref={ref}
      as="a"
      className={clsx(sHeadlessLink, props.className)}
      href={props.href}
      sx={props.sx}
    >
      {props.children}
    </View>
  );
};
