export const filterObject = <V>(
  obj: Record<string, V>,
  predicate: (arg0: [string, V]) => boolean,
): Record<string, V> => Object.fromEntries(Object.entries<V>(obj).filter(predicate));
