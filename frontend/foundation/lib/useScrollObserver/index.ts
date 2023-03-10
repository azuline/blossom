import { RefObject, useEffect } from "react";

type Options<T> = {
  ref: RefObject<T | undefined> | undefined;
  onScroll: (scrollTop: number) => void;
};

/**
 * An observer for a container's scroll events.
 */
export const useScrollObserver = <T extends Element>(options: Options<T>): void => {
  const { ref, onScroll } = options;

  useEffect(() => {
    const element = ref?.current;
    if (!element) {
      return;
    }

    function callback(this: T): void {
      onScroll(this.scrollTop);
    }
    element.addEventListener("scroll", callback, false);
    return () => element.removeEventListener("scroll", callback, false);
  }, [onScroll, ref]);
};
