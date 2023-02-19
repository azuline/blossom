import { Bleed } from "@foundation/ui/Bleed";
import { Card } from "@foundation/ui/Card";
import { Center } from "@foundation/ui/Center";
import { Flex } from "@foundation/ui/Flex";
import { Type } from "@foundation/ui/Type";
import { View } from "@foundation/ui/View";

export default {
  title: "Components/Primitives/Bleed",
};

export const Gallery: React.FC = () => (
  <Flex sx={{ wrap: "wrap", gap: "64" }}>
    <Card sx={{ w: "128", h: "128" }}>
      <Bleed m="36">
        <View style={{ border: "1px solid red" }} sx={{ w: "full", h: "full" }}>
          <Center>
            <Type>m=36</Type>
          </Center>
        </View>
      </Bleed>
    </Card>
    <Card sx={{ w: "128", h: "128" }}>
      <Bleed my="36">
        <View style={{ border: "1px solid red" }} sx={{ w: "full", h: "full" }}>
          <Center>
            <Type>my=36</Type>
          </Center>
        </View>
      </Bleed>
    </Card>
    <Card sx={{ w: "128", h: "128" }}>
      <Bleed mx="36">
        <View style={{ border: "1px solid red" }} sx={{ w: "full", h: "full" }}>
          <Center>
            <Type>mx=36</Type>
          </Center>
        </View>
      </Bleed>
    </Card>
    <Card sx={{ w: "128", h: "128" }}>
      <Bleed mt="36">
        <View style={{ border: "1px solid red" }} sx={{ w: "full", h: "full" }}>
          <Center>
            <Type>mt=36</Type>
          </Center>
        </View>
      </Bleed>
    </Card>
    <Card sx={{ w: "128", h: "128" }}>
      <Bleed mr="36">
        <View style={{ border: "1px solid red" }} sx={{ w: "full", h: "full" }}>
          <Center>
            <Type>mr=36</Type>
          </Center>
        </View>
      </Bleed>
    </Card>
    <Card sx={{ w: "128", h: "128" }}>
      <Bleed mb="36">
        <View style={{ border: "1px solid red" }} sx={{ w: "full", h: "full" }}>
          <Center>
            <Type>mb=36</Type>
          </Center>
        </View>
      </Bleed>
    </Card>
    <Card sx={{ w: "128", h: "128" }}>
      <Bleed ml="36">
        <View style={{ border: "1px solid red" }} sx={{ w: "full", h: "full" }}>
          <Center>
            <Type>ml=36</Type>
          </Center>
        </View>
      </Bleed>
    </Card>
  </Flex>
);
