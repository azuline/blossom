import { t } from "@foundation/style/theme.css";
import { globalFontFace, globalStyle } from "@vanilla-extract/css";

// Reset
// https://www.joshwcomeau.com/css/custom-css-reset/
globalStyle("*, *::before, *::after", {
  boxSizing: "border-box",
});
globalStyle("*", {
  margin: 0,
});
globalStyle("html, body, #root", {
  height: "100%",
});
globalStyle("body", {
  // lineHeight: 1.5,
  WebkitFontSmoothing: "antialiased",
});
globalStyle("img, picture, video, canvas, svg", {
  display: "block",
  maxWidth: "100%",
});
globalStyle("input, button, textarea, select", {
  font: "inherit",
});
globalStyle("p, h1, h2, h3, h4, h5, h6", {
  overflowWrap: "break-word",
});
globalStyle("#root", {
  isolation: "isolate",
});

// Custom component resets. We define them here instead of in the components themselves
// because this location has a lower specificity than sprinkles.
globalStyle("input", {
  background: "none",
  boxShadow: "none",
});
globalStyle("button", {
  background: "none",
  borderColor: "none",
  borderWidth: "none",
});

// Custom global styles.
globalFontFace(t.font.face.body, {
  fontStyle: "normal",
  fontWeight: "100 900",
  fontDisplay: "swap",
  src: "url('/fonts/Inter.var.woff2') format('woff2-variations')",
});
globalFontFace(t.font.face.body, {
  fontStyle: "italic",
  fontWeight: "100 900",
  fontDisplay: "swap",
  src: "url('/fonts/Inter-Italic.var.woff2') format('woff2-variations')",
});

// Default all typography to the standard text.
globalStyle("html", {
  fontFamily: `${t.font.face.body}, sans-serif`,
  fontSize: t.font.size.md,
  fontWeight: t.font.weight.regular,
});
// Enable optical sizing to enable Inter Display.
globalStyle("html", {
  fontOpticalSizing: "auto",
});
// Default all borders to solid style. This way, we do not need to specify `bstyle`
// everywhere.
globalStyle("*", {
  borderStyle: "solid",
  borderWidth: 0,
});
