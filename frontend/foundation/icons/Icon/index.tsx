import { ICONS_MAP } from "@foundation/icons/codegen/imports";
import { t } from "@foundation/theme/styles";
import { SX } from "@foundation/theme/styles/sprinkles.css";
import { View } from "@foundation/ui/View";
import { Suspense } from "react";

type Props = {
  icon: keyof typeof ICONS_MAP;
  color?: SX["color"];
  size?: keyof typeof t.font.size | "full";
  sx?: SX;
};

export const Icon: React.FC<Props> = props => {
  const Component = ICONS_MAP[props.icon];
  return (
    <View
      style={{
        display: "inline-block",
        lineHeight: 0,
        width: props.size && props.size !== "full" ? t.font.size[props.size] : undefined,
        height: props.size && props.size !== "full" ? t.font.size[props.size] : undefined,
      }}
      sx={{
        color: props.color,
        w: props.size === "full" ? "full" : undefined,
        h: props.size === "full" ? "full" : undefined,
        ...props.sx,
      }}
    >
      <Suspense fallback={<View sx={{ h: "full", w: "full" }} />}>
        <Component />
      </Suspense>
    </View>
  );
};
