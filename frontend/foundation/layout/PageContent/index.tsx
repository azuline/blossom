import { useHeaderExists } from "@foundation/layout/WithHeader/state";
import { mergeRefs } from "@foundation/lib/mergeRefs";
import { useScrollObserver } from "@foundation/lib/useScrollObserver";
import { View } from "@foundation/ui/View";
import { clsx } from "clsx";
import { MutableRefObject, useRef, useState } from "react";
import {
  sPageContentPadding,
  sPageContentScroll,
} from "./index.css";

type PageContentProps = {
  children: React.ReactNode;
  className?: string;
  /**
   * The padding of the page.
   * - `full` sets padding on the top, left, and right axes.
   * - `x` sets padding on the left and right axes only. The content will hug the
   *   header.
   * - `none` sets no padding.
   *
   * The application-wide shared padding tokens are used; exact padding values are not
   * configurable per-page.
   *
   * Bottom padding is set if the page is scrollable.
   *
   * @default full
   */
  padding?: "full" | "x" | "none";
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

  /** FOR VISUAL TESTING. DO NOT USE. */
  _scrollRef?: MutableRefObject<unknown>;
};

/**
 * 1. Apply the global layout padding.
 * 2. Handle possible page scrolls.
 * 3. Handle possible centered content.
 */
export const PageContent: React.FC<PageContentProps> = ({
  scroll = true,
  padding = "full",
  center = false,
  children,
  className,
  _scrollRef,
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
    <View
      ref={mergeRefs([ref, _scrollRef])}
      className={clsx(className, sPageContentScroll({ scroll, scrolled, headerExists }))}
    >
      <View
        className={sPageContentPadding({ padding, scroll, center, headerExists })}
      >
        {children}
      </View>
    </View>
  );
};
