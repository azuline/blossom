import { ICONS_MAP } from "@foundation/icons/codegen/imports";
import { Icon } from "@foundation/icons/Icon";
import { sIconGallery } from "@foundation/icons/Icon/index.css";
import { DocumentationStory } from "@foundation/stories/DocumentationStory";
import { StorySection } from "@foundation/stories/StorySection";
import { Variant } from "@foundation/stories/Variant";
import { VariantsGallery } from "@foundation/stories/VariantsGallery";
import { Flex } from "@foundation/ui/Flex";
import { Type } from "@foundation/ui/Type";
import { View } from "@foundation/ui/View";
import React from "react";

export default {
  title: "Components/Atoms",
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
          <Flex key={name} sx={{ direction: "column", gap: "4", align: "center" }}>
            <Icon color="neutral.strong" icon={name as keyof typeof ICONS_MAP} size="sm" />
            <Type sx={{ color: "neutral.weak" }} variant="xs">{name}</Type>
          </Flex>
        ))}
      </View>
    </StorySection>
  </DocumentationStory>
);
