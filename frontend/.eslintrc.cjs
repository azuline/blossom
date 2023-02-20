const fs = require("fs");

const excludedAliases = ["node_modules", "coverage", "public", "dist", "patches"];
// dprint-ignore
const importAliases =
  fs.readdirSync(".", { withFileTypes: true })
    .filter(x => x.isDirectory())
    .map(x => x.name)
    .filter(x => !excludedAliases.includes(x))
    .map(x => ({ alias: `@${x}`, matcher: `^${x}/` }));

module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: { jsx: true },
    project: "./tsconfig.json",
  },
  extends: [
    "airbnb",
    "airbnb-typescript",
    "airbnb/hooks",
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  plugins: ["@typescript-eslint", "unused-imports", "import-alias"],
  env: { es6: true, browser: true, jest: true },
  ignorePatterns: [".eslintrc.cjs", "vite.config.ts", "coverage"],
  rules: {
    // This goes off when we have useEffects that return either nothing or a cleanup
    // function.
    "consistent-return": "off",
    // Why does this exist...? I don't care where it goes.
    "implicit-arrow-linebreak": "off",
    "arrow-parens": "off",
    // I don't care and would rather have the optionality.
    "object-curly-newline": "off",
    "arrow-body-style": "off",
    curly: "error",
    // vanilla-extract really cares about the numbers being string types.
    "quote-props": ["warn", "as-needed", { numbers: true }],
    // With arrow functions and JSX, a comma is needed for syntax to parse.
    "comma-dangle": "off",
    "@typescript-eslint/comma-dangle": "off",
    // I like underscore dangle.
    "no-underscore-dangle": "off",
    // I happen to like large files sometimes.
    "max-classes-per-file": "off",

    // Disallow types and interfaces to begin with `I`.
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: ["interface", "typeAlias"],
        format: ["PascalCase"],
        custom: {
          regex: "^I[A-Z]",
          match: false,
        },
      },
    ],

    // Unused imports and variables.
    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": ["warn", {
      vars: "all",
      varsIgnorePattern: "^_",
      args: "after-used",
      argsIgnorePattern: "^_",
    }],
    "@typescript-eslint/no-unused-expressions": ["warn", {
      allowTaggedTemplates: true,
    }],

    // Imports
    "no-duplicate-imports": "warn",

    // This enforces that we use `@alias` imports and that we don't use `../`
    // parent imports.
    "import-alias/import-alias": ["warn", {
      relativeDepth: 0,
      rootDir: __dirname,
      aliases: importAliases,
    }],

    // Overrides for React.
    // There is a time and place for each...
    "react/function-component-definition": "off",
    // Goes off even though components are typed.
    "react/jsx-props-no-spreading": "off",
    // Goes off even though components are typed.
    "react/prop-types": "off",
    // Why would we want this? We have TypeScript.
    "react/require-default-props": "off",
    // Pretty sure this is fine with the new transform.
    "react/react-in-jsx-scope": "off",
    // There is a time and place for all destructuring assignment styles.
    "react/destructuring-assignment": "off",
    // I happen to find this really useful for casting ReactNode to ReactElement (<>{reactNode}</>).
    "react/jsx-no-useless-fragment": "off",
    // Prop/key sorting.
    "react/jsx-sort-props": ["warn", {
      callbacksLast: true,
      shorthandFirst: true,
      reservedFirst: true,
    }],

    // Overrides for @typescript-eslint.
    "@typescript-eslint/explicit-function-return-type": ["warn", { allowExpressions: true }],
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/quotes": "off",
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/restrict-template-expressions": ["error", { allowBoolean: true }],
    "@typescript-eslint/no-floating-promises": ["error", { ignoreIIFE: true }],
    // This is for the above no-floating-promises rule.
    "no-void": ["error", { allowAsStatement: true }],

    // Overrides for import.
    "import/prefer-default-export": "off",
    "import/order": "off",
    "import/extensions": "off",
    // Adding *.config.ts to the defaults.
    "import/no-extraneous-dependencies": ["error", {
      devDependencies: [
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.stories.tsx",
        "**/*.spec.ts",
        "**/*.spec.tsx",
        "**/*.config.ts",
        "**/foundation/testing/**",
      ],
    }],
  },
  settings: { react: { version: "detect" } },
};
