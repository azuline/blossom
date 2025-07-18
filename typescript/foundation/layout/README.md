# layout

The `layout` package contains page layout building blocks that are commonly used
across pages. With these primitives, every page can easily compose the page
architecture it desires.

The primitives are:

- `PageContent`: A component to conveniently configure the page's content. This
  component applies standardized configurations for content padding, scrolling,
  and centering.
- `WithHeader`: Apply the application header. Wrap the page with this component
  if the page should have a header.
