import { sHeaderLayout } from "@foundation/layout/WithHeader/index.css";
import { TypeLoader } from "@foundation/loaders/TypeLoader";
import { useRPC } from "@foundation/rpc";
import { Avatar } from "@foundation/ui/Avatar";
import { Flex } from "@foundation/ui/Flex";
import { Type } from "@foundation/ui/Type";
import { View } from "@foundation/ui/View";

type Props = {
  children: React.ReactNode;
};

export const WithHeader: React.FC<Props> = props => {
  const { data } = useRPC("GetPageLoadInfo", null);
  const tenant = data?.tenant?.name;

  return (
    <Flex sx={{ dir: "column", h: "full" }}>
      <View className={sHeaderLayout}>
        <Flex sx={{ h: "full", justify: "space-between", align: "center" }}>
          <Type sx={{ text: "disp-xl" }}>blossom</Type>
          <Flex sx={{ gap: "16", align: "center" }}>
            {/* TODO: Loader */}
            {tenant !== undefined ? <Type>{tenant}</Type> : <TypeLoader w="96" />}
            <Avatar size="36" />
          </Flex>
        </Flex>
      </View>
      <View sx={{ minh: "0", h: "full" }}>{props.children}</View>
    </Flex>
  );
};
