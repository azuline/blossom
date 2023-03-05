import { Type } from "@foundation/ui/Type";

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
