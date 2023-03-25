import { Stack } from "@foundation/ui";
import { Type } from "@foundation/ui";
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
  <Stack axis="y" gap="4">
    {props.children}
  </Stack>
);
