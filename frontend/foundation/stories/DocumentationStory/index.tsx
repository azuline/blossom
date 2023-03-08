import { Flex } from "@foundation/ui/Flex";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const DocumentationStory: React.FC<Props> = props => (
  <Flex sx={{ w: "full", h: "full", direction: "column", gap: "20" }}>
    {props.children}
  </Flex>
);
