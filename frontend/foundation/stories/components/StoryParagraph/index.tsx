import { FC, ReactNode } from "react";

import { Stack } from "@foundation/ui/Stack";
import { Type } from "@foundation/ui/Type";

type Props = { children: ReactNode };

export const StoryParagraph: FC<Props> = props => (
  <Type paragraph as="div">
    <Stack axis="y" gap="8" sx={{ maxw: "452" }}>{props.children}</Stack>
  </Type>
);
