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
        --ladle-bg-color-secondary: hsl(158, 6%, 93%);
      }
      .ladle-main {
        background: hsl(158, 6%, 97%);
      }
      .ladle-addons {
        bottom: 1em;
      }
    </style>
  `,
};
