import { FC, ReactNode } from "react";

import { Flex } from "@foundation/ui/Flex";
import { Type } from "@foundation/ui/Type";

type Props = { children: ReactNode };

export const StoryParagraph: FC<Props> = props => (
  <Type paragraph as="div">
    <Flex sx={{ direction: "column", gap: "8", maxw: "576" }}>{props.children}</Flex>
  </Type>
);
