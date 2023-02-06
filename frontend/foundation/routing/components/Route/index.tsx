import { filterObject } from "@foundation/lib/filterObject";
import { AppLoader } from "@foundation/loaders/AppLoader";
import { pathsAtom } from "@foundation/routing/state/paths";
import { useAtom } from "jotai";
import { lazy, Suspense, useEffect, useMemo } from "react";
import { Route as WouterRoute, useRoute } from "wouter";

type RouteProps = {
  path: string;
  factory: () => Promise<{ default: React.FC<object> }>;
};

// TODO: Figure out how to generically type route parameters.
export const Route = (props: RouteProps): React.ReactElement => {
  const [matches, params] = useRoute(props.path);
  const Page = useMemo(() => lazy(props.factory), [props.factory]);

  const [, setPaths] = useAtom(pathsAtom);

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
