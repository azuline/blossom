module.exports = {
  extends: [require.resolve("@configs/eslint")],
  rules: {
    // This package is used in test only.
    "import/no-extraneous-dependencies": ["error", {
      devDependencies: ["src/**/*.ts", "src/**/*.tsx"],
    }],
  },
};
