import { Flex } from "@foundation/ui/Flex";
import { View } from "@foundation/ui/View";

type Props = {
  children: React.ReactNode;
};

export const WithHeader: React.FC<Props> = props => {
  return (
    <Flex sx={{ dir: "column", h: "full" }}>
      <View sx={{ h: "64", bg: "neutral.weak" }}>header</View>
      <View sx={{ minh: "0", h: "full" }}>{props.children}</View>
    </Flex>
  );
};
