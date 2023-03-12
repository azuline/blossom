# std

The `std` package extends the standard library with functions that operate on
primitive data structures and/or provide basic functionality.

The functions are:

- `filterObject`: Filter out key/value pairs from an object with a predicate.
  Similar to Array.filter, but for objects.
- `flattenRecord`: Flatten a nested record into a record of maxdepth=1.
  Concatenate keys such that `flattenRecord({a: {b: 1}}) -> {"a.b": 1}`.
- `mergeRefs`: Merge multiple React refs into a single ref.

And the hooks are:

- `useScrollObserver`: An observer for a container's scroll events.
