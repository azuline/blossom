export default {
  stories: ["foundation/**/*.stories.tsx", "product/**/*stories.tsx"],
  addons: {
    theme: {
      enabled: false,
    },
  },
  appendToHead: `
    <style>
      #ladle-root {
        --ladle-bg-color-secondary: #E7E6F0;
      }
      .ladle-main {
        background: #F1F1F6;
        padding: 0;
      }
      .ladle-addons {
        bottom: 1em;
      }
    </style>
  `,
};
