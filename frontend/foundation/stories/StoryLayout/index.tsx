import { Flex } from "@foundation/ui/Flex";
import { View } from "@foundation/ui/View";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const StoryLayout: React.FC<Props> = props => (
  <Flex sx={{ py: "36", pl: "36" }}>
    <Flex sx={{ direction: "column", gap: "44" }}>
      {props.children}
    </Flex>
    {
      // Forces a right padding, whereas the right padding would typically be collapsed
      // in a scrollable container. We can't do width: full/fit-content tricks here,
      // because that would prevent Playwright from taking a screenshot of the full
      // container in our visual tests.
    }
    <View sx={{ w: "36", h: "full" }} />
  </Flex>
);
