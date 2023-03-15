import { StorySection } from "@foundation/stories/components/StorySection";
import { View } from "@foundation/ui/View";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { ReactNode } from "react";
import { sVariantsGallery, sVariantsGalleryColumns } from "./index.css";

type Props = {
  title?: string;
  columns: number;
  alignItems?: "center" | "start" | "end";
  justifyItems?: "center" | "start" | "end";
  children: ReactNode;
};

export const VariantsGallery: React.FC<Props> = props => (
  <StorySection title={props.title ?? "Variants"}>
    <View
      className={sVariantsGallery}
      style={{
        alignItems: props.alignItems ?? "center",
        justifyItems: props.justifyItems ?? "center",
        ...assignInlineVars({ [sVariantsGalleryColumns]: props.columns.toString() }),
      }}
    >
      {props.children}
    </View>
  </StorySection>
);
