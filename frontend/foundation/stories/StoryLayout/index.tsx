import { Flex } from "@foundation/ui/Flex";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const StoryLayout: React.FC<Props> = props => (
  <Flex sx={{ w: "full", p: "36", direction: "column", gap: "44" }}>
    {props.children}
  </Flex>
);
