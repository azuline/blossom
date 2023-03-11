import { Flex } from "@foundation/ui/Flex";
import { Type } from "@foundation/ui/Type";
import { View } from "@foundation/ui/View";
import { FC } from "react";

type ColorPaletteProps = { palette: Record<string, string> };
export const ColorPalette: FC<ColorPaletteProps> = props => (
  <Flex>
    {Object.entries(props.palette).map(([name, color]) => (
      <Color key={name} color={color} name={name} />
    ))}
  </Flex>
);

type ColorProps = { name: string; color: string };
const Color: FC<ColorProps> = props => (
  <Flex sx={{ direction: "column", gap: "16", align: "center" }}>
    <View style={{ background: props.color }} sx={{ h: "64", w: "96" }} />
    <Type sx={{ whiteSpace: "nowrap", textTransform: "capitalize" }}>{props.name}</Type>
  </Flex>
);
