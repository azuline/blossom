/* eslint-disable @typescript-eslint/explicit-function-return-type */
// ^ Disable because I really don't want to type the output of lazy imports.

import { useCurrentTenant, useCurrentUser } from "@foundation/auth";
import { Route, Switch } from "@foundation/routing";

export const Router: React.FC = () => {
  const auths = useUserAuthorizations();
  // The router is built as a top-down cascade, where the first path matched gets
  // rendered.
  //
  // We handle auth restrictions here. The AuthorizationGate component only renders its
  // children if the specified authorization level is met. And if the required
  // authorization level is not met, then the application will not render those routes
  // and will instead render the login page.
  return (
    <Switch>
      {auths.tenant && (
        <>
          <Route factory={() => import("@product/home")} path="/" />
        </>
      )}
      {auths.user && (
        <>
          <Route factory={() => import("@product/home")} path="/" />
        </>
      )}
      {auths.public && (
        <>
          <Route factory={() => import("@product/login")} path="/*?" />
        </>
      )}
      <Route factory={() => import("@product/notfound")} path="/*?" />
    </Switch>
  );
};

type UserAuthorizations = {
  tenant: boolean;
  user: boolean;
  public: boolean;
};

const useUserAuthorizations = (): UserAuthorizations => {
  const user = useCurrentUser() !== undefined;
  const tenant = useCurrentTenant() !== undefined;
  const public_ = !tenant && !user;
  return { user, tenant, public: public_ };
};
