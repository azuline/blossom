import { View } from "@foundation/ui/View";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { ReactNode } from "react";
import { sStoryGallery, sStoryGalleryColumns } from "./index.css";

type Props = {
  columns: number;
  children: ReactNode;
};

export const StoryGallery: React.FC<Props> = props => (
  <View
    className={sStoryGallery}
    style={assignInlineVars({ [sStoryGalleryColumns]: props.columns.toString() })}
  >
    {props.children}
  </View>
);
