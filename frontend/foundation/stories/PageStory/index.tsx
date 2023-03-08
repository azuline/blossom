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
          style={{ height: Math.max(540, (width * 9) / 16) }}
          sx={{
            w: "fit-content",
            maxw: "full",
            bcol: "neutral.default",
            bwidth: "1",
            radius: "16",
            overflowX: "auto",
          }}
        >
          <View style={{ width }} sx={{ h: "full" }}>
            {props.children}
          </View>
        </View>
      </StorySection>
    ))}
  </>
);
