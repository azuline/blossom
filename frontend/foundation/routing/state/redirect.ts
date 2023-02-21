import { usePrefetchPath } from "@foundation/routing/state/prefetch";
import { startTransition, useCallback, useEffect } from "react";
import { useLocation } from "wouter";

export type RedirectFn = () => void;
export type RedirectFnWithoutPrefetch = (route: string) => void;

/**
 * useRedirect allows for the user to be redirected to another page. This hook preloads
 * the destination page when the hook is first called, which is why we need the route
 * parameter at the hook call time.
 *
 * See useRedirectWithoutPrefetch for a redirect function that does not require the
 * route parameter at hook call time.
 */
export const useRedirect = (route: string): RedirectFn => {
  const prefetch = usePrefetchPath();
  useEffect(() => prefetch(route), [prefetch, route]);
  const [, setLocation] = useLocation();
  return useCallback(() => {
    // TODO: Does startTransition even work with the history API?
    startTransition(() => {
      setLocation(route);
    });
  }, [setLocation, route]);
};

/**
 * useRedirectWithoutPrefetch is a facade around setLocation. Prefer useRedirect because
 * it enables route preloading, but if the route is not known at hook call time, this
 * hook will still work.
 */
export const useRedirectWithoutPrefetch = (): RedirectFnWithoutPrefetch => {
  const [, setLocation] = useLocation();
  return useCallback((route: string) => {
    startTransition(() => {
      setLocation(route);
    });
  }, [setLocation]);
};
