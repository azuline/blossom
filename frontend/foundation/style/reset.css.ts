import { globalStyle } from "@vanilla-extract/css";

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
