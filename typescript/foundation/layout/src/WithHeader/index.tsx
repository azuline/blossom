import { useCurrentTenant } from "@foundation/auth";
import { TypeLoader } from "@foundation/loaders";
import { Avatar, Stack, Type, View } from "@foundation/ui";
import { sHeaderLayout, sLogoFont } from "./index.css";
import { HeaderExistsContextProvider } from "./state";

type Props = {
  children: React.ReactNode;
};

/**
 * Apply the application header. Wrap the page with this component if the page should
 * have a header.
 */
export const WithHeader: React.FC<Props> = props => {
  const tenant = useCurrentTenant();

  return (
    <HeaderExistsContextProvider value>
      <Stack axis="y" sx={{ w: "full", h: "full" }} x="space">
        <View className={sHeaderLayout}>
          <Stack axis="x" sx={{ w: "full" }} x="space" y="center">
            <Type className={sLogoFont}>blossom</Type>
            {/* TODO: Responsive gap prop. */}
            <Stack axis="x" sx={{ gap: { initial: "10", md: "16" } }} y="center">
              {tenant !== undefined
                ? <Type sx={{ whiteSpace: "nowrap" }}>{tenant.name}</Type>
                : <TypeLoader w="96" />}
              <Avatar size="28" />
            </Stack>
          </Stack>
        </View>
        <View style={{ flex: "1 1" }} sx={{ minh: "0" }}>{props.children}</View>
      </Stack>
    </HeaderExistsContextProvider>
  );
};
