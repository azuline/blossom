/* eslint-disable */

// The types come from https://stackoverflow.com/a/69111325.
type Entry = { key: string | number; value: any; optional: boolean };

type Explode<T> = T extends object ? {
    [K in keyof T]-?: K extends string | number
      ? Explode<T[K]> extends infer E ? E extends Entry ? {
            key: `${K}${E["key"] extends "" ? "" : "."}${E["key"]}`;
            value: E["value"];
            optional: E["key"] extends "" ? {} extends Pick<T, K> ? true : false
              : E["optional"];
          }
        : never
      : never
      : never;
  }[keyof T]
  : { key: ""; value: T; optional: false };

type Collapse<T extends Entry> = (
  & { [E in Extract<T, { optional: false }> as E["key"]]: E["value"] }
  & Partial<{ [E in Extract<T, { optional: true }> as E["key"]]: E["value"] }>
) extends infer O ? { [K in keyof O]: O[K] } : never;

type Flatten<T> = Collapse<Explode<T>>;

const isObject = (x: unknown) => !!x && x.constructor === Object;

export const flattenRecord = <T extends Record<string, unknown>>(
  input: T,
): Flatten<T> => {
  const rval: Record<string, unknown> = {};

  const walk = (x: Record<string, unknown>, prefix = "") => {
    for (const [key, val] of Object.entries(x)) {
      if (isObject(val)) {
        walk(val as Record<string, unknown>, `${prefix}${key}.`);
      } else {
        rval[`${prefix}${key}`] = val;
      }
    }
  };

  walk(input);
  return rval as Flatten<T>;
};
