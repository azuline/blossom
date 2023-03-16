import { SX } from "@foundation/theme/styles/sprinkles.css";
import { Flex } from "@foundation/ui/Flex";
import { Type } from "@foundation/ui/Type";
import { ReactNode } from "react";

type Props =
  & {
    children: ReactNode;
    /** @default column */
    align?: "column" | "row";
    sx?: SX;
  }
  & ({
    title: ReactNode;
    subtitle?: undefined;
    subsubtitle?: undefined;
  } | {
    title?: undefined;
    subtitle: ReactNode;
    subsubtitle?: undefined;
  } | {
    title?: undefined;
    subtitle?: undefined;
    subsubtitle: ReactNode;
  });

export const StorySection: React.FC<Props> = props => (
  <Flex sx={{ direction: "column", gap: "20", ...props.sx }}>
    {props.title && <Type variant="disp-xxl">{props.title}</Type>}
    {props.subtitle && <Type variant="disp-xl">{props.subtitle}</Type>}
    {props.subsubtitle && <Type variant="disp-lg">{props.subsubtitle}</Type>}
    <Flex sx={{ direction: props.align ?? "column", gap: "20", wrap: "wrap" }}>
      {props.children}
    </Flex>
  </Flex>
);
