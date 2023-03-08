import { Flex } from "@foundation/ui/Flex";
import { Type } from "@foundation/ui/Type";
import { ReactNode } from "react";

type Props = {
  title: ReactNode;
  children: ReactNode;
};

export const StorySection: React.FC<Props> = props => (
  <Flex sx={{ direction: "column", gap: "28" }}>
    <Type variant="disp-xl">{props.title}</Type>
    {props.children}
  </Flex>
);
