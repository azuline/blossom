import { SX } from "@foundation/theme/styles/sprinkles.css";
import { Stack, StackProps } from "@foundation/ui";
import { Type } from "@foundation/ui";
import { ReactNode } from "react";

type Props =
  & {
    children: ReactNode;
    /** @default y */
    axis?: StackProps["axis"];
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
  <Stack axis="y" gap="20" sx={props.sx}>
    {props.title && <Type variant="disp-xl">{props.title}</Type>}
    {props.subtitle && <Type variant="disp-lg">{props.subtitle}</Type>}
    {props.subsubtitle && <Type variant="disp-md">{props.subsubtitle}</Type>}
    <Stack wrap axis={props.axis ?? "y"} gap="20">
      {props.children}
    </Stack>
  </Stack>
);
