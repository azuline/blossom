import { PageContent } from "@foundation/layout/PageContent";
import { Button } from "@foundation/ui/Button";
import { Stack } from "@foundation/ui/Stack";
import { Type } from "@foundation/ui/Type";

const NotFoundPage: React.FC = () => (
  <PageContent center>
    <Stack axis="y" gap="28">
      <Type variant="disp-xl">404 Page Not Found</Type>
      <Button as="a" href="/">Return home</Button>
    </Stack>
  </PageContent>
);

export default NotFoundPage;
