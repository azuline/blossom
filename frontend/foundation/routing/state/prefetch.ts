import { pathsAtom } from "@foundation/routing/state/paths";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { useRouter } from "wouter";

export const usePrefetchPath = (route: string | undefined): void => {
  const router = useRouter();
  const [paths] = useAtom(pathsAtom);

  const prefetch = useCallback((to: string) => {
    const path = Array.from(Object.keys(paths)).find(
      pattern => router.matcher(pattern, to)[0],
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
