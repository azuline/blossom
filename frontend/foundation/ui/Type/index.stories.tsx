import { Flex } from "@foundation/ui/Flex";
import { Type } from "@foundation/ui/Type";

export default {
  title: "Components/Primitives/Type",
};

export const Gallery: React.FC = () => (
  <Flex sx={{ direction: "column", gap: "16" }}>
    <Type variant="disp-xxl">DISP-XXL Text</Type>
    <Type variant="disp-xl">DISP-XL Text</Type>
    <Type variant="disp-lg">DISP-LG Text</Type>
    <Type variant="lg">LG Text</Type>
    <Type variant="md">MD Text</Type>
    <Type variant="sm">SM Text</Type>
    <Type variant="xs">XS Text</Type>
  </Flex>
);
