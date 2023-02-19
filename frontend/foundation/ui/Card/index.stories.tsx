import { Card } from "@foundation/ui/Card";
import { Flex } from "@foundation/ui/Flex";

export default {
  title: "Components/Atoms/Card",
};

export const Gallery: React.FC = () => (
  <Flex sx={{ wrap: "wrap", gap: "16" }}>
    <Card emph="strong" sx={{ maxw: "272", h: "96" }}>
      Strong card card card card card card card card
    </Card>
    <Card emph="default" sx={{ maxw: "272", h: "96" }}>
      Default card card card card card card card card
    </Card>
    <Card emph="weak" sx={{ maxw: "272", h: "96" }}>
      Weak card card card card card card card card
    </Card>
    <Card emph="inverse" sx={{ maxw: "272", h: "96" }}>
      Inverse card card card card card card card card
    </Card>
  </Flex>
);
