import { Card } from "@foundation/ui/Card";

export default {
  title: "Components/Atoms/Card",
};

export const Emph1: React.FC = () => (
  <Card sx={{ maxw: "15" }}>Card card card card card card card card</Card>
);

export const Emph2: React.FC = () => (
  <Card emph="2" sx={{ maxw: "15" }}>Card card card card card card card card</Card>
);

export const Emph3: React.FC = () => (
  <Card emph="3" sx={{ maxw: "15" }}>Card card card card card card card card</Card>
);

export const Inverse: React.FC = () => (
  <Card emph="inverse" sx={{ maxw: "15" }}>Card card card card card card card card</Card>
);
