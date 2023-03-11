# style

The `style` package contains our application theme and global styles. We export
a token object at `t` and a vanilla-extract sprinkles function as `sx`.

## CSS Reset

We use Josh Comeau's [Modern CSS Reset](https://www.joshwcomeau.com/css/custom-css-reset/).

We also have a series of component-specific custom resets to smooth over the
browser implementations so that the UI Library doesn't clash with native styles.
