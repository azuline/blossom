import { PageContent } from "@foundation/layout";
import { Button } from "@foundation/ui";
import { Stack } from "@foundation/ui";
import { Type } from "@foundation/ui";

const NotFoundPage: React.FC = () => (
  <PageContent center>
    <Stack axis="y" gap="28">
      <Type variant="disp-xl">404 Page Not Found</Type>
      <Button as="a" href="/">Return home</Button>
    </Stack>
  </PageContent>
);

export default NotFoundPage;
