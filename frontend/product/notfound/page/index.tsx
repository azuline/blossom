import { Icon } from "@foundation/icons/Icon";
import { PageContent } from "@foundation/layout/PageContent";
import { Button } from "@foundation/ui/Button";
import { Flex } from "@foundation/ui/Flex";
import { Type } from "@foundation/ui/Type";

const NotFoundPage: React.FC = () => (
  <PageContent center>
    <Flex sx={{ direction: "column", gap: "44" }}>
      <Flex sx={{ align: "center", gap: "44" }}>
        <Icon icon="logo" size="xxl" />
        <Type variant="disp-xl">404 Page Not Found</Type>
      </Flex>
      <Button href="/">Return home</Button>
    </Flex>
  </PageContent>
);

export default NotFoundPage;
