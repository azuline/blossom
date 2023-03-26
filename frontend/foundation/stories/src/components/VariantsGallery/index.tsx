import { StorySection } from "../StorySection";
import { View } from "@foundation/ui";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { ReactNode } from "react";
import { sVariantsGallery, sVariantsGalleryColumns } from "./index.css";

type Props = {
  title?: string;
  subtitle?: string;
  columns: number;
  alignItems?: "center" | "start" | "end";
  justifyItems?: "center" | "start" | "end";
  children: ReactNode;
};

export const VariantsGallery: React.FC<Props> = props => (
  <StorySection
    subsubtitle={undefined}
    subtitle={props.subtitle as undefined}
    title={props.subtitle === undefined ? (props.title ?? "Variants") : undefined}
  >
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
