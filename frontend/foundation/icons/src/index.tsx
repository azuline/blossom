import { SX, sx, t } from "@foundation/theme";
import { Suspense } from "react";
import { ICONS_MAP } from "./codegen/imports";

export { ICONS_MAP };

type Props = {
  icon: keyof typeof ICONS_MAP;
  color?: SX["color"];
  size?: keyof typeof t.font.size.body | "full";
  sx?: SX;
};

export const Icon: React.FC<Props> = props => {
  const Component = ICONS_MAP[props.icon];
  return (
    <div
      className={sx({
        color: props.color,
        w: props.size === "full" ? "full" : undefined,
        h: props.size === "full" ? "full" : undefined,
        ...props.sx,
      })}
      style={{
        display: "inline-block",
        lineHeight: 0,
        width: props.size && props.size !== "full" ? t.font.size.body[props.size] : undefined,
        height: props.size && props.size !== "full" ? t.font.size.body[props.size] : undefined,
      }}
    >
      <Suspense fallback={<div className={sx({ h: "full", w: "full" })} />}>
        <Component />
      </Suspense>
    </div>
  );
};
