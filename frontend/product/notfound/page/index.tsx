import { PageContent } from "@foundation/layout/PageContent";
import { Button } from "@foundation/ui/Button";
import { Flex } from "@foundation/ui/Flex";
import { Type } from "@foundation/ui/Type";

const NotFoundPage: React.FC = () => (
  <PageContent center>
    <Flex sx={{ direction: "column", gap: "44" }}>
      <Type variant="disp-xl">404 Page Not Found</Type>
      <Button href="/">Return home</Button>
    </Flex>
  </PageContent>
);

export default NotFoundPage;
