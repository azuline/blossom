import { IconLogo } from "@foundation/icons/IconLogo";
import { Flex } from "@foundation/ui/Flex";
import { Type } from "@foundation/ui/Type";
import { ApplicationLayout } from "@product/layout";

const NotFoundPage: React.FC = () => (
  <ApplicationLayout>
    <Flex sx={{ dir: "column", align: "center", justify: "center", h: "full", gap: "9" }}>
      <Flex sx={{ align: "center", gap: "9" }}>
        <IconLogo size="10" />
        <Type sx={{ text: "disp-xxl" }}>404 Page Not Found</Type>
      </Flex>
      <Type sx={{ text: "disp-xxl" }}>Go Home TODO Link Component</Type>
    </Flex>
  </ApplicationLayout>
);

export default NotFoundPage;
