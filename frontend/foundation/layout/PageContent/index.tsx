import { useHeaderExists } from "@foundation/layout/WithHeader/state";
import { useScrollObserver } from "@foundation/lib/useScrollObserver";
import { View } from "@foundation/ui/View";
import { clsx } from "clsx";
import { useRef, useState } from "react";
import {
  sPageContentPadding,
  sPageContentScroll,
} from "./index.css";

type PageContentProps = {
  children: React.ReactNode;
  className?: string;
  /**
   * Whether the top of the page should have padding. If false, the page content will
   * hug the header. If true, the header and content will have well-balanced spacing.
   * @default true
   */
  topPadding?: boolean;
  /**
   * Whether the page should scroll on content overflow. Set to false to have the page
   * grow with the content.
   * @default true
   */
  scroll?: boolean;
  /**
   * Whether the page's content should be centered.
   * @default false
   */
  center?: boolean;
};

/**
 * 1. Apply the global layout padding.
 * 2. Handle possible page scrolls.
 * 3. Handle possible centered content.
 */
export const PageContent: React.FC<PageContentProps> = ({
  scroll = true,
  topPadding = true,
  center = false,
  children,
  className,
}) => {
  // If the header exists, offset a centered page by a little bit.
  const headerExists = useHeaderExists();

  // Track whether the content is scrolled so that we can render a top border
  // on scroll.
  const ref = useRef(null);
  const [scrolled, setScrolled] = useState<boolean>(false);
  useScrollObserver({ ref, onScroll: scrollTop => setScrolled(scrollTop !== 0) });

  // We need padding to live within scroll so that we don't suffer from padding collapse
  // on the right border.
  return (
    <View ref={ref} className={clsx(className, sPageContentScroll({ scroll, scrolled }))}>
      <View className={sPageContentPadding({ topPadding, scroll, center, headerExists })}>
        {children}
      </View>
    </View>
  );
};
