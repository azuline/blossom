import { Flex } from "@foundation/ui/Flex";
import { Type } from "@foundation/ui/Type";
import { ReactNode } from "react";

type Props = {
  label: string;
  value: string;
};

export const Variant: React.FC<Props> = props => (
  <Type sx={{ whiteSpace: "nowrap" }}>
    <Type sx={{ color: "neutral.weak" }} variant="xs">{props.label}=</Type>
    <Type sx={{ color: "neutral.default" }} variant="xs">{props.value}</Type>
  </Type>
);

export const VariantGroup: React.FC<{ children: ReactNode }> = props => (
  <Flex sx={{ direction: "column", gap: "4" }}>
    {props.children}
  </Flex>
);
