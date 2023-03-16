import { FC, ReactNode } from "react";

type PortalProps = {
  children: ReactNode;
};

export const Portal: FC<PortalProps> = props => {
  return <>{props.children}</>;
};
