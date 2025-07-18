# icons

The `icons` package exposes a single `Icon` component with which icons can be
rendered in the application.

The `Icon` component lazy loads icons, preventing icons from increasing the
initial bundle size. This also allows for a single `Icon` component to be used
as the entrypoint for all icons: a superior developer experience.

Visit the [story](https://celestial.sunsetglow.net/?story=components--atoms--icon-)
for additional documentation on the icon component.

## Icon Choice

The base icon set is vendored from the [Feather](https://feathericons.com/)
icon set. A few custom icon additions have been added.

We did not vendor the complete set of Feather icons. A subset of icons from
Feather v4.29.0 have been vendored.

## Development

The icons system is codegen-driven development. The development flow looks
like:

1. Raw icon SVGs are vendored into `svgs/`, arranged into subdirectories based
   on icon source.
2. The `scripts/svgs-to-react.py` script transforms the source SVGs into
   React components. These components are outputted into `codegen/icons`.
3. The `scripts/generate-imports.py` script generates a map of dynamic imports
   for the icon components. This is outputted to `codegen/import.ts`.

The `Icon` component consumes the import map for type-safe icon selection and
dynamic lazy imports.
