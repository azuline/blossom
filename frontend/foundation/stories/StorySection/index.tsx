import { Flex } from "@foundation/ui/Flex";
import { Type } from "@foundation/ui/Type";
import { ReactNode } from "react";

type Props =
  & {
    children: ReactNode;
  }
  & ({
    title: ReactNode;
    subtitle?: undefined;
  } | {
    title?: undefined;
    subtitle: ReactNode;
  });

export const StorySection: React.FC<Props> = props => (
  <Flex sx={{ direction: "column", gap: "20" }}>
    {props.title && <Type variant="disp-xl">{props.title}</Type>}
    {props.subtitle && <Type variant="disp-lg">{props.subtitle}</Type>}
    {props.children}
  </Flex>
);
