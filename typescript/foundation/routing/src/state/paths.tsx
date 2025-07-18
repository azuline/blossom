import { atom, PrimitiveAtom } from "jotai";

type Paths = Record<string, () => Promise<unknown>>;
export const availablePathsAtom: PrimitiveAtom<Paths> = atom({});
