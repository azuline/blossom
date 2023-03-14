import { fontFaces } from "@foundation/theme/themes/type.css";
import { globalFontFace, globalStyle } from "@vanilla-extract/css";
import { t } from ".";

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
globalStyle("*:focus:not(:focus-visible)", {
  // Turn off focus styles on click. Only set them when focus is visible (i.e. keyboard
  // navigation).
  outline: "none !important",
});
globalStyle("*:focus-visible", {
  // Set a custom focus style.
  outline: t.outline.focus.value,
  outlineOffset: t.outline.focus.offset,
});

// Custom component resets. We define them here instead of in the components themselves
// because this location has a lower specificity than sprinkles.
globalStyle("input", {
  background: "none",
  boxShadow: "none",
  color: "inherit",
});
globalStyle("button", {
  background: "none",
  borderColor: "none",
  borderWidth: "none",
});
globalStyle("a", {
  textDecoration: "none",
  color: "inherit",
});

// Custom global styles.

// Default all borders to solid style. This way, we do not need to specify `bstyle`
// everywhere.
globalStyle("*", {
  borderStyle: "solid",
  borderWidth: 0,
});

// Font loading.
globalFontFace(fontFaces.body, {
  fontStyle: "normal",
  fontWeight: "400",
  fontDisplay: "swap",
  src: "url('/fonts/AlegreyaSans-Regular.woff2') format('woff2')",
});
globalFontFace(fontFaces.body, {
  fontStyle: "italic",
  fontWeight: "400",
  fontDisplay: "swap",
  src: "url('/fonts/AlegreyaSans-Italic.woff2') format('woff2')",
});
globalFontFace(fontFaces.body, {
  fontStyle: "normal",
  fontWeight: "700",
  fontDisplay: "swap",
  src: "url('/fonts/AlegreyaSans-Bold.woff2') format('woff2')",
});
globalFontFace(fontFaces.body, {
  fontStyle: "italic",
  fontWeight: "700",
  fontDisplay: "swap",
  src: "url('/fonts/AlegreyaSans-BoldItalic.woff2') format('woff2')",
});
globalFontFace(fontFaces.display, {
  fontStyle: "normal",
  fontWeight: "500",
  fontDisplay: "swap",
  src: "url('/fonts/CormorantGaramond-Medium.woff2') format('woff2')",
});
globalFontFace(fontFaces.display, {
  fontStyle: "italic",
  fontWeight: "500",
  fontDisplay: "swap",
  src: "url('/fonts/CormorantGaramond-MediumItalic.woff2') format('woff2')",
});
globalFontFace(fontFaces.display, {
  fontStyle: "normal",
  fontWeight: "700",
  fontDisplay: "swap",
  src: "url('/fonts/CormorantGaramond-Bold.woff2') format('woff2')",
});
globalFontFace(fontFaces.display, {
  fontStyle: "italic",
  fontWeight: "700",
  fontDisplay: "swap",
  src: "url('/fonts/CormorantGaramond-BoldItalic.woff2') format('woff2')",
});
globalFontFace(fontFaces.display, {
  fontStyle: "italic",
  fontWeight: "300",
  fontDisplay: "swap",
  src: "url('/fonts/CormorantGaramond-LightItalic.woff2') format('woff2')",
});
globalFontFace(fontFaces.code, {
  fontStyle: "italic",
  fontWeight: "200 900",
  fontDisplay: "swap",
  src: "url('/fonts/SourceCodePro-Italic-Variable.woff2') format('woff2')",
});
globalFontFace(fontFaces.code, {
  fontStyle: "normal",
  fontWeight: "200 900",
  fontDisplay: "swap",
  src: "url('/fonts/SourceCodePro-Roman-Variable.woff2') format('woff2')",
});
