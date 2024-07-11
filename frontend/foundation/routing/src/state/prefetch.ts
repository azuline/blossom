import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { useRouter } from "wouter";
import { availablePathsAtom } from "./paths";

export const usePrefetchPath = (route: string | undefined): void => {
  const router = useRouter();
  const [paths] = useAtom(availablePathsAtom);

  const prefetch = useCallback((to: string) => {
    const path = Array.from(Object.keys(paths)).find(
      p => router.parser(p).pattern.test(to),
    );
    if (path === undefined) {
      return;
    }

    const fetcher = paths[path];
    if (fetcher !== undefined) {
      // Run the lazy promise.
      void fetcher().then(v => v);
    }
  }, [paths, router]);

  useEffect(() => {
    if (route) {
      prefetch(route);
    }
  }, [prefetch, route]);
};
