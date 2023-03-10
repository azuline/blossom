# lib

The `lib` package contains functions that essentially consist an extended standard
library. Since JS' standard library is quite poor, we augment it with functions
of our choice.

The functions are:

- `filterObject`: Filter out key/value pairs from an object with a predicate.
  Similar to Array.filter, but for objects.
- `flattenRecord`: Flatten a nested record into a record of maxdepth=1.
  Concatenate keys such that `flattenRecord({a: {b: 1}}) -> {"a.b": 1}`.
- `mergeRefs`: Merge multiple React refs into a single ref.

The hooks are:

- `useScrollObserver`: An observer for a container's scroll events.
