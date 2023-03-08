import { Icon } from "@foundation/icons/Icon";
import { LayoutPadding } from "@foundation/layout/LayoutPadding";
import { Button } from "@foundation/ui/Button";
import { Flex } from "@foundation/ui/Flex";
import { Type } from "@foundation/ui/Type";

const NotFoundPage: React.FC = () => (
  <LayoutPadding>
    <Flex sx={{ direction: "column", align: "center", justify: "center", h: "full", gap: "44" }}>
      <Flex sx={{ align: "center", gap: "44" }}>
        <Icon icon="logo" size="xxl" />
        <Type variant="disp-xl">404 Page Not Found</Type>
      </Flex>
      <Button href="/">Return home</Button>
    </Flex>
  </LayoutPadding>
);

export default NotFoundPage;
