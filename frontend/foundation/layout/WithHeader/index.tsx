import { useCurrentTenant } from "@foundation/auth/state";
import { sHeaderLayout, sLogoFont } from "@foundation/layout/WithHeader/index.css";
import { HeaderExistsContextProvider } from "@foundation/layout/WithHeader/state";
import { TypeLoader } from "@foundation/loaders/TypeLoader";
import { Avatar } from "@foundation/ui/Avatar";
import { Flex } from "@foundation/ui/Flex";
import { Type } from "@foundation/ui/Type";
import { View } from "@foundation/ui/View";

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
      <Flex sx={{ direction: "column", h: "full" }}>
        <View className={sHeaderLayout}>
          <Flex sx={{ h: "full", justify: "space-between", align: "center" }}>
            <Type className={sLogoFont}>blossom</Type>
            <Flex sx={{ gap: { initial: "16", md: "8" }, align: "center" }}>
              {tenant !== undefined
                ? <Type sx={{ whiteSpace: "nowrap" }}>{tenant.name}</Type>
                : <TypeLoader w="96" />}
              <Avatar size="28" />
            </Flex>
          </Flex>
        </View>
        <View style={{ flex: "1 1" }} sx={{ minh: "0" }}>{props.children}</View>
      </Flex>
    </HeaderExistsContextProvider>
  );
};
