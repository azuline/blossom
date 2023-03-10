import { LayoutPaddingVariableSetter } from "@foundation/layout/LayoutPaddingVariableSetter";
import { PageContent } from "@foundation/layout/PageContent";
import { WithHeader } from "@foundation/layout/WithHeader";
import { DocumentationStory } from "@foundation/stories/DocumentationStory";
import { Variant, VariantGroup } from "@foundation/stories/Variant";
import { VariantsGallery } from "@foundation/stories/VariantsGallery";
import { Card } from "@foundation/ui/Card";
import { Type } from "@foundation/ui/Type";
import { FC, ReactNode, useEffect, useRef } from "react";

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
