import { View } from "@foundation/ui/View";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { ReactNode } from "react";
import { sVariantsGallery, sVariantsGalleryColumns } from "./index.css";

type Props = {
  columns: number;
  children: ReactNode;
};

export const VariantsGallery: React.FC<Props> = props => (
  <View
    className={sVariantsGallery}
    style={assignInlineVars({ [sVariantsGalleryColumns]: props.columns.toString() })}
  >
    {props.children}
  </View>
);
