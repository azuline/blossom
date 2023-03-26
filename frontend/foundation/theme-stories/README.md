# theme-stories

The `theme-stories` package is split from `theme` to avoid a dependency cycle.
The `stories` package depends on `theme`, which means `theme` cannot depend on
`stories`. Since `theme`'s stories use the `stories` package, the stories need
to be in a separate package.
