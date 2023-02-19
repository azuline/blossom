import { RPCError } from "@foundation/errors/rpc";
import { atomForm } from "@foundation/form/state";
import { IconLogo } from "@foundation/icons/IconLogo";
import { LayoutPadding } from "@foundation/layout/LayoutPadding";
import { rpc, useRefetchRPC } from "@foundation/rpc";
import { Button } from "@foundation/ui/Button";
import { Center } from "@foundation/ui/Center";
import { Checkbox } from "@foundation/ui/Checkbox";
import { Flex } from "@foundation/ui/Flex";
import { TextField } from "@foundation/ui/TextField";
import { Type } from "@foundation/ui/Type";
import { atom, useAtom } from "jotai";

const loginFormAtom = atomForm<{
  email: string;
  password: string;
  permanent: boolean;
}>({
  email: "",
  password: "",
  permanent: false,
});

const errorAtom = atom<string | null>(null);

const LoginPage: React.FC = () => {
  const [form, setForm] = useAtom(loginFormAtom);
  const [error, setError] = useAtom(errorAtom);
  const refetchAuth = useRefetchRPC();

  const submit = async (): Promise<void> => {
    const resp = await rpc("Login", form, e => {
      if (e.error === "InvalidCredentialsError") {
        setError("Invalid login credentials. Please re-check your email and password.");
        return true;
      }
      setError("Unexpected error occurred. Please try again later.");
      throw e;
    });
    if (resp instanceof RPCError) {
      return;
    }

    await refetchAuth("GetPageLoadInfo");
    // TODO: Redirect to /
  };

  return (
    <LayoutPadding>
      <Center>
        <Flex sx={{ dir: "column", gap: "36", w: "356" }}>
          <Center axis="vertical">
            <IconLogo size="64" />
          </Center>
          <Type sx={{ text: "disp-xl" }}>Welcome back!</Type>
          <Flex sx={{ dir: "column", gap: "20" }}>
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
            {error !== null && <Type sx={{ text: "sm", col: "negative.default" }}>{error}</Type>}
          </Flex>
          <Button fullWidth size="lg" onPress={submit}>Sign in</Button>
        </Flex>
      </Center>
    </LayoutPadding>
  );
};

export default LoginPage;
