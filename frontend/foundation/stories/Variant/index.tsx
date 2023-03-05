import { Type } from "@foundation/ui/Type";

type Props = {
  label: string;
  value: string;
};

export const Variant: React.FC<Props> = props => (
  <Type sx={{ whiteSpace: "nowrap" }}>
    <Type sx={{ text: "xs", col: "neutral.weak" }}>{props.label}=</Type>
    <Type sx={{ text: "xs", col: "neutral.default" }}>{props.value}</Type>
  </Type>
);
