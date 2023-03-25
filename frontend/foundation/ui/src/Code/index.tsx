import { FontCodeVariant } from "@foundation/theme/styles";
import { SX } from "@foundation/theme/styles/sprinkles.css";
import { Type, TypeProps } from "@foundation/ui/Type";
import { CSSProperties, FC } from "react";

type Props = {
  variant?: FontCodeVariant;
  className?: string;
  sx?: SX;
  children?: React.ReactNode;
  style?: CSSProperties;
} & Pick<TypeProps, "italic" | "paragraph">;

export const Code: FC<Props> = props => (
  <Type
    {...props}
    sx={{ ...props.sx, background: "neutral.inset", px: "4", py: "2", radius: "4" }}
    variant={props.variant ?? "code-xs"}
  >
    {props.children}
  </Type>
);
