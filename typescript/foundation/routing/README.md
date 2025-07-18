# routing

The `routing` package builds on top of [wouter](https://github.com/molefrog/wouter).
We additionally implement lazy loading, suspense support, and page prefetching.

To enable page prefetching, we push for static definitions of redirect paths as
early as possible. This is why the `useRedirect` hook requires the redirect
destination at hook call time: it allows us to prefetch the destination page in
advance.
