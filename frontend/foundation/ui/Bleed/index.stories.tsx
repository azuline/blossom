import { Bleed } from "@foundation/ui/Bleed";
import { Card } from "@foundation/ui/Card";
import { Center } from "@foundation/ui/Center";
import { Flex } from "@foundation/ui/Flex";
import { Type } from "@foundation/ui/Type";
import { View } from "@foundation/ui/View";
import { ReactNode } from "react";

export default {
  title: "Components/Primitives",
};

export const Bleed_: React.FC = () => (
  <Flex sx={{ wrap: "wrap", gap: "64" }}>
    <CardWrapper>
      <Bleed m="36">
        <Content>m=36</Content>
      </Bleed>
    </CardWrapper>
    <CardWrapper>
      <Bleed my="36">
        <Content>my=36</Content>
      </Bleed>
    </CardWrapper>
    <CardWrapper>
      <Bleed mx="36">
        <Content>mx=36</Content>
      </Bleed>
    </CardWrapper>
    <CardWrapper>
      <Bleed mt="36">
        <Content>mt=36</Content>
      </Bleed>
    </CardWrapper>
    <CardWrapper>
      <Bleed mr="36">
        <Content>mr=36</Content>
      </Bleed>
    </CardWrapper>
    <CardWrapper>
      <Bleed mb="36">
        <Content>mb=36</Content>
      </Bleed>
    </CardWrapper>
    <CardWrapper>
      <Bleed ml="36">
        <Content>ml=36</Content>
      </Bleed>
    </CardWrapper>
  </Flex>
);

type CardWrapperProps = { children: ReactNode };

const CardWrapper: React.FC<CardWrapperProps> = props => (
  <Card sx={{ w: "128", h: "128" }}>
    {props.children}
  </Card>
);

type ContentProps = { children: ReactNode };

const Content: React.FC<ContentProps> = props => (
  <View style={{ border: "1px solid red" }} sx={{ w: "full", h: "full" }}>
    <Center>
      <Type>{props.children}</Type>
    </Center>
  </View>
);
