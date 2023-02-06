import { atom } from "jotai";

type Paths = Record<string, () => Promise<unknown>>;
export const pathsAtom = atom<Paths>({});
