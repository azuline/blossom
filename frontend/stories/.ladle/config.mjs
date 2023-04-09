export default {
  stories: ["src/**/*.stories.tsx"],
  storyOrder: [
    "hello--introduction",
    "guides--*",
    "theme--*",
    "primitives--*",
    "layout--*",
    "atoms--*",
    "molecules--*",
    "loaders--*",
    "pages--*",
    "*",
  ],
  addons: {
    width: { enabled: false },
    links: { enabled: false },
  },
  appendToHead: `
    <style>
      #ladle-root {
        --ladle-bg-color-secondary: #E7E6F0;
        background: #F1F1F6;
        color: #08051B;
      }
      /**
       * This is a selector for preview mode. In preview mode, we want 100%
       * height so that full page stories render with the full screen.
       */
      #ladle-root:not(.ladle-wrapper) {
        height: 100%;
      }
      .ladle-main {
        background: #F1F1F6;
        padding: 0;

        /* Fix mobile scrolling. */
        width: 100%;
        overflow-x: auto;
      }
      .ladle-addons {
        bottom: 1em;
      }
      @media (min-width: 768px) [data-mode="full"] html, [data-mode="full"] body, [data-mode="full"] .ladle-main {
        width: unset;
        overflow-x: unset;
      }

      /* Dark mode. */
      html[data-theme="dark"] #ladle-root {
        --ladle-bg-color-secondary: #2E2C3D;
        background: #1F1D2D;
        color: #F9F9FB;
      }
      html[data-theme="dark"] .ladle-main {
        background: #1F1D2D;
      }
    </style>
  `,
};
