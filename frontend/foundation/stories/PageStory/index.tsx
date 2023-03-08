import { StorySection } from "@foundation/stories/StorySection";
import { View } from "@foundation/ui/View";
import { ReactNode } from "react";

const SCREEN_SIZES = [
  1920,
  1440,
  1200,
  992,
  768,
  576,
  440,
  300,
];

type Props = {
  children: ReactNode;
};

export const PageStory: React.FC<Props> = props => (
  <>
    {SCREEN_SIZES.map(width => (
      <StorySection key={width} title={<>Screen {width}px</>}>
        <View
          style={{ width, height: Math.max(540, (width * 9) / 16) }}
          sx={{ bcol: "neutral.default", bwidth: "1", radius: "16" }}
        >
          {props.children}
        </View>
      </StorySection>
    ))}
  </>
);
