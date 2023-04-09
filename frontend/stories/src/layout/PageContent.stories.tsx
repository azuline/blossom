import { LayoutPaddingVariableSetter, PageContent, WithHeader } from "@foundation/layout";
import { Card, Type } from "@foundation/ui";
import { FC, ReactNode, useEffect, useRef } from "react";
import { DocumentationStory } from "../lib/DocumentationStory";
import { StoryParagraph } from "../lib/StoryParagraph";
import { StorySection } from "../lib/StorySection";
import { Variant, VariantGroup } from "../lib/Variant";
import { VariantsGallery } from "../lib/VariantsGallery";

export default {
  title: "Layout",
};

// dprint-ignore
export const PageContent_: React.FC = () => {
  // Scroll to the bottom of containers to snapshot the scroll behavior.
  const scrolledRef1 = useRef<HTMLDivElement>(null);
  const scrolledRef2 = useRef<HTMLDivElement>(null);
  const scrolledRef3 = useRef<HTMLDivElement>(null);
  const scrolledRef4 = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrolledRef1.current?.scroll({ top: 100 });
    scrolledRef2.current?.scroll({ top: 100 });
    scrolledRef3.current?.scroll({ top: 100 });
    scrolledRef4.current?.scroll({ top: 100 });
  });

  return (
    <DocumentationStory>
      <StorySection title="Description">
        <StoryParagraph>
          The PageContent component configures the layout of a new page. It configures
          the padding, scrolling, and optional centering of the page content.
        </StoryParagraph>
      </StorySection>
      <VariantsGallery columns={3}>
        <Type />
        <Variant label="header" value="none" />
        <Variant label="header" value="exists" />

        <Variant label="padding" value="full" />
        <FakePage><PageContent padding="full"><LoremIpsumShort /></PageContent></FakePage>
        <FakePage><WithHeader><PageContent padding="full"><LoremIpsumShort /></PageContent></WithHeader></FakePage>

        <Variant label="padding" value="x" />
        <FakePage><PageContent padding="x"><LoremIpsumShort /></PageContent></FakePage>
        <FakePage><WithHeader><PageContent padding="x"><LoremIpsumShort /></PageContent></WithHeader></FakePage>

        <Variant label="padding" value="none" />
        <FakePage><PageContent padding="none"><LoremIpsumShort /></PageContent></FakePage>
        <FakePage><WithHeader><PageContent padding="none"><LoremIpsumShort /></PageContent></WithHeader></FakePage>

        <Variant label="scroll" value="true" />
        <FakePage><PageContent padding="full"><LoremIpsumLong /></PageContent></FakePage>
        <FakePage><WithHeader><PageContent padding="full"><LoremIpsumLong /></PageContent></WithHeader></FakePage>

        <Variant label="scroll" value="true (scrolled)" />
        <FakePage><PageContent _scrollRef={scrolledRef1} padding="full"><LoremIpsumLong /></PageContent></FakePage>
        <FakePage><WithHeader><PageContent _scrollRef={scrolledRef2} padding="full"><LoremIpsumLong /></PageContent></WithHeader></FakePage>

        <VariantGroup>
          <Variant label="center" value="true" />
          <Variant label="scroll" value="true" />
        </VariantGroup>
        <FakePage><PageContent center padding="full"><LoremIpsumShort /></PageContent></FakePage>
        <FakePage><WithHeader><PageContent center padding="full"><LoremIpsumShort /></PageContent></WithHeader></FakePage>

        <VariantGroup>
          <Variant label="center" value="true" />
          <Variant label="scroll" value="true (scrolled)" />
        </VariantGroup>
        <FakePage><PageContent center _scrollRef={scrolledRef3} padding="full"><LoremIpsumLong /></PageContent></FakePage>
        <FakePage><WithHeader><PageContent center _scrollRef={scrolledRef4} padding="full"><LoremIpsumLong /></PageContent></WithHeader></FakePage>

        <VariantGroup>
          <Variant label="center" value="true" />
          <Variant label="scroll" value="false" />
        </VariantGroup>
        <FakePage><PageContent center padding="full" scroll={false}><LoremIpsumShort /></PageContent></FakePage>
        <FakePage><WithHeader><PageContent center padding="full" scroll={false}><LoremIpsumShort /></PageContent></WithHeader></FakePage>
      </VariantsGallery>
    </DocumentationStory>
  );
};

const FakePage: FC<{ children: ReactNode }> = props => (
  <Card padding="none" sx={{ w: "356", h: "216", overflow: "hidden" }}>
    <LayoutPaddingVariableSetter>
      {props.children}
    </LayoutPaddingVariableSetter>
  </Card>
);

const LoremIpsumShort: FC = () => (
  <Type paragraph>
    Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
  </Type>
);

const LoremIpsumLong: FC = () => (
  <Type paragraph>
    Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
    lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
    lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
    lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
    lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
    lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
  </Type>
);
