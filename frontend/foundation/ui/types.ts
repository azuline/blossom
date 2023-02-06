import { ElementType } from "react";

export type LabellableProps = {
  label: string;
  "aria-label"?: never;
} | {
  label?: never;
  "aria-label": string;
};

export type PolymorphicProp = { as?: ElementType };
