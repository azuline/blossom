import { atom, WritableAtom } from "jotai";

export const atomForm = <T extends Record<string, unknown>>(
  initialValues: T,
): WritableAtom<T, [Partial<T>], void> => {
  const primitiveAtom = atom<T>(initialValues);
  return atom<T, [Partial<T>], void>(
    get => get(primitiveAtom),
    (get, set, update) => set(primitiveAtom, { ...get(primitiveAtom), ...update }),
  );
};
