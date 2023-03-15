import { FontVariant, t } from "@foundation/theme/styles";
import { SX } from "@foundation/theme/styles/sprinkles.css";
import { PolymorphicProp } from "@foundation/ui/types";
import { View } from "@foundation/ui/View";
import { CSSProperties } from "react";

export type TypeProps = PolymorphicProp & {
  className?: string;
  sx?: SX;
  variant?: FontVariant;
  children?: React.ReactNode;
  strong?: boolean;
  italic?: boolean;
  underline?: boolean;
  /**
   * If the text is multi-line paragraph body font. By default, label text has no
   * additional line height, which inhibits readability for multi-line paragraphs. This
   * option adds additional line height for comfortable paragraph reading.
   */
  paragraph?: boolean;
  style?: CSSProperties;
};

export const Type: React.FC<TypeProps> = props => {
  const {
    as = "span",
    className,
    sx,
    children,
    variant,
    strong,
    italic,
    underline,
    paragraph,
    style,
    ...passthru
  } = props;

  const type = variant === undefined
      && strong === undefined
      && italic === undefined
      && underline === undefined
      && paragraph === undefined
    ? undefined
    : t.fn.font(variant ?? "sm", { strong, underline, italic, paragraph });

  return (
    <View
      {...passthru}
      as={as}
      className={className}
      style={{ ...style, ...type }}
      sx={{ display: "inline", ...sx }}
    >
      {children}
    </View>
  );
};
