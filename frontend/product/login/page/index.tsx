import { RPCs } from "@codegen/rpc";
import { atomForm } from "@foundation/forms/state";
import { Icon } from "@foundation/icons/Icon";
import { PageContent } from "@foundation/layout/PageContent";
import { useRedirect } from "@foundation/routing/state/redirect";
import { rpc, useRefetchRPC } from "@foundation/rpc";
import { RPCError } from "@foundation/rpc/error";
import { Button } from "@foundation/ui/Button";
import { Center } from "@foundation/ui/Center";
import { Checkbox } from "@foundation/ui/Checkbox";
import { Flex } from "@foundation/ui/Flex";
import { TextField } from "@foundation/ui/TextField";
import { Type } from "@foundation/ui/Type";
import { useAtom } from "jotai";
import { useState } from "react";

const loginFormAtom = atomForm<RPCs["Login"]["in"]>({
  email: "",
  password: "",
  permanent: false,
  tenant_external_id: null,
});

const LoginPage: React.FC = () => {
  const [form, setForm] = useAtom(loginFormAtom);
  const [error, setError] = useState<string | null>(null);
  const refetchRPC = useRefetchRPC();
  const redirectHome = useRedirect("/");

  const submit = async (): Promise<void> => {
    const resp = await rpc("Login", form);
    if (resp instanceof RPCError) {
      if (resp.error === "InvalidCredentialsError") {
        setError("Invalid login credentials. Please re-check your email and password.");
        return;
      }
      setError("Unexpected error occurred. Please try again later.");
      throw resp;
    }

    await refetchRPC("GetPageLoadInfo");
    redirectHome();
  };

  return (
    <PageContent center>
      <Flex sx={{ direction: "column", gap: "36", w: "356" }}>
        <Center axis="vertical">
          <Icon icon="logo" sx={{ w: "64", h: "64" }} />
        </Center>
        <Type variant="disp-xl">Welcome back!</Type>
        <Flex sx={{ direction: "column", gap: "20" }}>
          <TextField
            label="Email"
            value={form.email}
            onChange={email => setForm({ email })}
          />
          <TextField
            label="Password"
            value={form.password}
            onChange={password => setForm({ password })}
          />
          <Checkbox
            checked={form.permanent}
            label="Remember me"
            onChange={permanent => setForm({ permanent })}
          />
          {error !== null && <Type sx={{ color: "negative.default" }} variant="sm">{error}</Type>}
        </Flex>
        <Button fullWidth size="lg" onPress={submit}>Sign in</Button>
      </Flex>
    </PageContent>
  );
};

export default LoginPage;
