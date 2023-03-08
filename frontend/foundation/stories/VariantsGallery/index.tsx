import { StorySection } from "@foundation/stories/StorySection";
import { Bleed } from "@foundation/ui/Bleed";
import { View } from "@foundation/ui/View";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { ReactNode } from "react";
import { sVariantsGallery, sVariantsGalleryColumns } from "./index.css";

type Props = {
  columns: number;
  children: ReactNode;
};

export const VariantsGallery: React.FC<Props> = props => (
  <StorySection title="Variants">
    <Bleed mx="36">
      <View sx={{ w: "full", overflowX: "auto" }}>
        <View
          className={sVariantsGallery}
          style={assignInlineVars({ [sVariantsGalleryColumns]: props.columns.toString() })}
        >
          {props.children}
        </View>
      </View>
    </Bleed>
  </StorySection>
);
