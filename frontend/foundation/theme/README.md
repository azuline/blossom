# theme

The `theme` package contains our application theme and global styles. We export
a token object at `t` and a vanilla-extract sprinkles function as `sx`.

## Figma Tokens

We develop the design system's color palette and theme variables in Figma with
the Figma Tokens plugin. The Figma Tokens plugin relies on a git repository to
version changes. Our Figma Tokens file is located at `figma/tokens.json`.

## Theme Generation

The Figma Tokens file is the source of truth for the color palette and theme.
We have a codegen step to convert the Figma Tokens `tokens.json` into
TypeScript records. The codegen step can be ran as follows:

```bash
$ ./scripts/codegen.py
```

The generated TypeScript theme files will be available in `codegen/*.css.ts`.

## CSS Reset

We use Josh Comeau's [Modern CSS Reset](https://www.joshwcomeau.com/css/custom-css-reset/).

We also have a series of component-specific custom resets to smooth over the
browser implementations so that the UI Library doesn't clash with native styles.
