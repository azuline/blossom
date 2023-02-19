import { IconLogo } from "@foundation/icons/IconLogo";
import { LayoutPadding } from "@foundation/layout/LayoutPadding";
import { Flex } from "@foundation/ui/Flex";
import { Type } from "@foundation/ui/Type";

const NotFoundPage: React.FC = () => (
  <LayoutPadding>
    <Flex sx={{ dir: "column", align: "center", justify: "center", h: "full", gap: "44" }}>
      <Flex sx={{ align: "center", gap: "44" }}>
        <IconLogo size="64" />
        <Type sx={{ text: "disp-xl" }}>404 Page Not Found</Type>
      </Flex>
      <Type sx={{ text: "disp-xl" }}>Go Home TODO Link Component</Type>
    </Flex>
  </LayoutPadding>
);

export default NotFoundPage;
