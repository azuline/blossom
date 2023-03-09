# layout

The `layout` package contains page layout building blocks that are commonly used
across pages. With these primitives, every page can easily compose the page
architecture it desires.

The primitives are:

- `LayoutPadding`: Apply the global layout padding. Wrap the page with this
  component if the page should have padding. Abstracting the padding into
  LayoutPadding ensures that all pages have consistent paddings.
- `WithHeader`: Apply the application header. Wrap the page with this component
  if the page should have a header.
