import { atom } from "jotai";

type Paths = Record<string, () => Promise<unknown>>;
export const availablePathsAtom = atom<Paths>({});
