import { useCurrentTenant } from "@foundation/auth/state";
import { sHeaderLayout, sLogoFont } from "@foundation/layout/WithHeader/index.css";
import { TypeLoader } from "@foundation/loaders/TypeLoader";
import { Avatar } from "@foundation/ui/Avatar";
import { Flex } from "@foundation/ui/Flex";
import { Type } from "@foundation/ui/Type";
import { View } from "@foundation/ui/View";

type Props = {
  children: React.ReactNode;
};

export const WithHeader: React.FC<Props> = props => {
  const tenant = useCurrentTenant();

  return (
    <Flex sx={{ direction: "column", h: "full" }}>
      <View className={sHeaderLayout}>
        <Flex sx={{ h: "full", justify: "space-between", align: "center" }}>
          <Type className={sLogoFont}>blossom</Type>
          <Flex sx={{ gap: "16", align: "center" }}>
            {tenant !== undefined ? <Type>{tenant.name}</Type> : <TypeLoader w="96" />}
            <Avatar size="36" />
          </Flex>
        </Flex>
      </View>
      <View sx={{ minh: "0", h: "full" }}>{props.children}</View>
    </Flex>
  );
};
