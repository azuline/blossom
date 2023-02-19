import { IconLogo } from "@foundation/icons/IconLogo";
import { ApplicationLayout } from "@foundation/layout/ApplicationLayout";
import { Flex } from "@foundation/ui/Flex";
import { Type } from "@foundation/ui/Type";

const NotFoundPage: React.FC = () => (
  <ApplicationLayout>
    <Flex sx={{ dir: "column", align: "center", justify: "center", h: "full", gap: "44" }}>
      <Flex sx={{ align: "center", gap: "44" }}>
        <IconLogo size="64" />
        <Type sx={{ text: "disp-xl" }}>404 Page Not Found</Type>
      </Flex>
      <Type sx={{ text: "disp-xl" }}>Go Home TODO Link Component</Type>
    </Flex>
  </ApplicationLayout>
);

export default NotFoundPage;
