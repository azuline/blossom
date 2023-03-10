/**
 * Merge multiple react refs into a single ref.
 */
export const mergeRefs = <T = unknown>(
  refs: Array<React.MutableRefObject<T> | React.LegacyRef<T> | null | undefined>,
): React.RefCallback<T> => {
  return value => {
    refs.forEach(ref => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        // eslint-disable-next-line no-param-reassign
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
};
