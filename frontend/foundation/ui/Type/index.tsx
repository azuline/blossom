import { SX } from "@foundation/theme/styles/sprinkles.css";
import { FontVariant, t } from "@foundation/theme/styles/theme";
import { PolymorphicProp } from "@foundation/ui/types";
import { View } from "@foundation/ui/View";

type Props = PolymorphicProp & {
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
};

export const Type: React.FC<Props> = props => {
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
    ...passthru
  } = props;

  const style = variant === undefined
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
      style={style}
      sx={{ display: "inline", ...sx }}
    >
      {children}
    </View>
  );
};
