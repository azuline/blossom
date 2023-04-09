import { Icon, ICONS_MAP } from "@foundation/icons";
import { Stack, Type, View } from "@foundation/ui";
import React from "react";
import { DocumentationStory } from "../lib/DocumentationStory";
import { StorySection } from "../lib/StorySection";
import { Variant } from "../lib/Variant";
import { VariantsGallery } from "../lib/VariantsGallery";
import { sIconGallery } from "./index.css";

export default {
  title: "Atoms",
};

export const Icon_: React.FC = () => (
  <DocumentationStory>
    <VariantsGallery columns={4}>
      <Type />
      <Variant label="size" value="xs" />
      <Variant label="size" value="sm" />
      <Variant label="size" value="md" />

      <Variant label="color" value="neutral.weak" />
      <Icon color="neutral.weak" icon="star" size="xs" />
      <Icon color="neutral.weak" icon="star" size="sm" />
      <Icon color="neutral.weak" icon="star" size="md" />

      <Variant label="color" value="neutral.default" />
      <Icon color="neutral.default" icon="star" size="xs" />
      <Icon color="neutral.default" icon="star" size="sm" />
      <Icon color="neutral.default" icon="star" size="md" />

      <Variant label="color" value="neutral.strong" />
      <Icon color="neutral.strong" icon="star" size="xs" />
      <Icon color="neutral.strong" icon="star" size="sm" />
      <Icon color="neutral.strong" icon="star" size="md" />

      <Variant label="color" value="brand.default" />
      <Icon color="brand.default" icon="star" size="xs" />
      <Icon color="brand.default" icon="star" size="sm" />
      <Icon color="brand.default" icon="star" size="md" />
    </VariantsGallery>
    <StorySection title="Available Icons">
      <View className={sIconGallery}>
        {Object.keys(ICONS_MAP).sort().map(name => (
          <Stack key={name} axis="y" gap="4" x="center">
            <Icon color="neutral.strong" icon={name as keyof typeof ICONS_MAP} size="sm" />
            <Type sx={{ color: "neutral.weak" }} variant="xs">{name}</Type>
          </Stack>
        ))}
      </View>
    </StorySection>
  </DocumentationStory>
);
