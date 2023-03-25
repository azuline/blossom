import { PageContent } from "@foundation/layout";
import { WithHeader } from "@foundation/layout";
import { Button } from "@foundation/ui";
import { Stack } from "@foundation/ui";
import { Type } from "@foundation/ui";

const HomePage: React.FC = () => (
  <WithHeader>
    <PageContent center>
      <Stack axis="y" gap="28">
        <Stack axis="y" gap="16" sx={{ maxw: "452" }}>
          <Type variant="disp-lg">Hi, hello, welcome home!</Type>
          <Type paragraph>
            In the Northern Ocean there is a fish called Kun which is many thousand li in size. It
            changes into a bird named Peng whose back is many thousand li in breadth. When it rises
            and flies, its wings are like clouds filling the sky.
          </Type>
        </Stack>
        <Button onPress={() => {}}>Take me there</Button>
      </Stack>
    </PageContent>
  </WithHeader>
);

export default HomePage;
