import { filterObject } from "@foundation/lib/filterObject";
import { AppLoader } from "@foundation/loaders/AppLoader";
import { availablePathsAtom } from "@foundation/routing/state/paths";
import { useAtom } from "jotai";
import { FC, lazy, ReactNode, Suspense, useEffect, useMemo } from "react";
import { Route as WouterRoute, useRoute } from "wouter";

type RouteProps = {
  path: string;
  factory: () => Promise<{ default: FC<object> }>;
};

// TODO: Figure out how to generically type route parameters.
export const Route: FC<RouteProps> = props => {
  const [matches, params] = useRoute(props.path);
  const Page = useMemo(() => lazy(props.factory), [props.factory]);

  const [, setPaths] = useAtom(availablePathsAtom);

  useEffect(() => {
    setPaths(ps => ({ ...ps, [props.path]: props.factory }));
    return () => setPaths(ps => filterObject(ps, ([k]) => k === props.path));
  }, [setPaths, props.path, props.factory]);

  return (
    <WouterRoute path={props.path}>
      {matches && (
        <Suspense fallback={<AppLoader />}>
          <Page {...params} />
        </Suspense>
      )}
    </WouterRoute>
  );
};

type InlineRouteProps = {
  path: string;
  page: ReactNode;
};

/**
 * Primarily meant for testing; supports loading routes inline without code splitting.
 */
export const InlineRoute: FC<InlineRouteProps> = props => {
  return (
    <WouterRoute path={props.path}>
      {props.page}
    </WouterRoute>
  );
};
