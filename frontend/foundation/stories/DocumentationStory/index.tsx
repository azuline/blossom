import { Flex } from "@foundation/ui/Flex";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

// Forces a right padding, whereas the right padding would typically be collapsed
// in a scrollable container. We can't do width: full/fit-content tricks here,
// because that would prevent Playwright from taking a screenshot of the full
// container in our visual tests.
export const DocumentationStory: React.FC<Props> = props => (
  <Flex sx={{ p: "36", w: "fit-content", h: "full" }}>
    <Flex sx={{ direction: "column", gap: "44", w: "fit-content", h: "full" }}>
      {props.children}
    </Flex>
  </Flex>
);
