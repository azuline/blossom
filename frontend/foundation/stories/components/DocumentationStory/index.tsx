import { Space } from "@foundation/theme/styles/sprinkles.css";
import { Flex } from "@foundation/ui/Flex";
import { View } from "@foundation/ui/View";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  gap?: Space;
};

// Forces a right padding, whereas the right padding would typically be collapsed
// in a scrollable container. We can't do width: full/fit-content tricks here,
// because that would prevent Playwright from taking a screenshot of the full
// container in our visual tests.
export const DocumentationStory: React.FC<Props> = props => (
  // The height is split from the width so that the background can fill more width than
  // just `fit-content`. This lets the background expand to the full screen even if the
  // content is half-width. Solves a background issue in Ladle preview mode.
  <View sx={{ h: "fit-content", background: "neutral.base" }}>
    {/* Extra padding-bottom so that no content is covered up by the Ladle hover overlay. */}
    <Flex sx={{ px: "36", pt: "36", pb: "96", w: "fit-content" }}>
      <Flex
        sx={{ direction: "column", gap: props.gap ?? "44", w: "fit-content", h: "fit-content" }}
      >
        {props.children}
      </Flex>
    </Flex>
  </View>
);
