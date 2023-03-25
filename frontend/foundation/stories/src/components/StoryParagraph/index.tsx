import { FC, ReactNode } from "react";

import { Stack, Type } from "@foundation/ui";

type Props = { children: ReactNode };

export const StoryParagraph: FC<Props> = props => (
  <Type paragraph as="div">
    <Stack axis="y" gap="8" sx={{ maxw: "452" }}>{props.children}</Stack>
  </Type>
);
