import { Card } from "@foundation/ui/Card";
import { Flex } from "@foundation/ui/Flex";

export default {
  title: "Components/Atoms/Card",
};

export const Gallery: React.FC = () => (
  <Flex sx={{ wrap: "wrap", gap: "16" }}>
    <Card emph="strong" sx={{ maxw: "272", h: "96" }}>
      Strong card card card. There is a beginning. There is no beginning of that beginning. There is
      no beginning of that no beginning of beginning.
    </Card>
    <Card emph="default" sx={{ maxw: "272", h: "96" }}>
      Default card card card. There is something. There is nothing. There is something before the
      beginning of something and nothing, and something before that.
    </Card>
    <Card emph="weak" sx={{ maxw: "272", h: "96" }}>
      Weak card card card. Suddenly there is something and nothing. But between something and
      nothing, I still don’t really know which is something and which is nothing.
    </Card>
    <Card emph="inverse" sx={{ maxw: "272", h: "96" }}>
      Inverse card card card. Now, I’ve just said something, but I don’t really know whether I’ve
      said anything or not.
    </Card>
  </Flex>
);
