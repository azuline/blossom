import { Flex } from "@foundation/ui/Flex";
import { Type } from "@foundation/ui/Type";

export default {
  title: "Components/Primitives/Type",
};

export const Gallery: React.FC = () => (
  <Flex sx={{ dir: "column", gap: "6" }}>
    <Type sx={{ text: "xs" }}>XS Text</Type>
    <Type sx={{ text: "sm" }}>SM Text</Type>
    <Type sx={{ text: "md" }}>MD Text</Type>
    <Type sx={{ text: "lg" }}>LG Text</Type>
    <Type sx={{ text: "disp-lg" }}>DISP-LG Text</Type>
    <Type sx={{ text: "disp-xl" }}>DISP-XL Text</Type>
    <Type sx={{ text: "disp-xxl" }}>DISP-XXL Text</Type>
  </Flex>
);
