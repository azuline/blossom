import { pathsAtom } from "@foundation/routing/state/paths";
import { useAtom } from "jotai";
import { useCallback } from "react";
import { useRouter } from "wouter";

type PrefetchPath = (to: string) => void;

export const usePrefetchPath = (): PrefetchPath => {
  const router = useRouter();
  const [paths] = useAtom(pathsAtom);
  return useCallback((to: string) => {
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
};
