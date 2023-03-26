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
  plugins: ["@typescript-eslint", "unused-imports"],
  env: { es6: true, browser: true, jest: true },
  ignorePatterns: [
    "coverage",
    ".eslintrc.cjs",
    "public",
    "!.ladle",
    "build",
    "dist",
    "node_modules",
  ],
  rules: {
    // This goes off when we have useEffects that return either nothing or a cleanup
    // function.
    "consistent-return": "off",
    // I don't care and would rather have the optionality.
    "object-curly-newline": "off",
    // vanilla-extract really cares about the numbers being string types.
    "quote-props": ["warn", "as-needed", { numbers: true }],
    // I like underscore dangle.
    "no-underscore-dangle": "off",
    // I happen to like large files sometimes.
    "max-classes-per-file": "off",
    // There is a time and place for both, and honestly I don't think it
    // matters which one is used or even if its inconsistent.
    "prefer-arrow-callback": "off",

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
    "@typescript-eslint/no-floating-promises": ["error", { ignoreIIFE: true }],
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/restrict-template-expressions": ["error", { allowBoolean: true }],
    // This is for the above no-floating-promises rule.
    "no-void": ["error", { allowAsStatement: true }],

    // Overrides for import.
    "import/prefer-default-export": "off",
    "import/order": "off",
    "import/extensions": "off",
    "import/no-extraneous-dependencies": ["error", {
      devDependencies: [
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.stories.tsx",
        "**/*.spec.ts",
        "**/*.spec.tsx",
        // Adding the below to the defaults.
        "**/*.config.ts",
        "**/foundation/testing/**",
      ],
    }],

    // Vendored from https://github.com/mysticatea/eslint-plugin-dprint/blob/master/lib/configs/disable-conflict-rules.ts.
    // Disables eslint rules that conflict with dprint.
    "array-bracket-newline": "off",
    "array-bracket-spacing": "off",
    "array-element-newline": "off",
    "arrow-body-style": "off",
    "arrow-parens": "off",
    "arrow-spacing": "off",
    "block-spacing": "off",
    "brace-style": "off",
    "comma-dangle": "off",
    "comma-spacing": "off",
    "comma-style": "off",
    "computed-property-spacing": "off",
    "dot-location": "off",
    "eol-last": "off",
    "func-call-spacing": "off",
    "function-call-argument-newline": "off",
    "function-paren-newline": "off",
    "generator-star": "off",
    "generator-star-spacing": "off",
    "implicit-arrow-linebreak": "off",
    indent: "off",
    "indent-legacy": "off",
    "jsx-quotes": "off",
    "key-spacing": "off",
    "keyword-spacing": "off",
    "linebreak-style": "off",
    "max-len": "off",
    "multiline-ternary": "off",
    "new-parens": "off",
    "newline-per-chained-call": "off",
    "no-arrow-condition": "off",
    "no-comma-dangle": "off",
    "no-confusing-arrow": "off",
    "no-extra-semi": "off",
    "no-floating-decimal": "off",
    "no-mixed-spaces-and-tabs": "off",
    "no-multi-spaces": "off",
    "no-multiple-empty-lines": "off",
    "no-reserved-keys": "off",
    "no-spaced-func": "off",
    "no-space-before-semi": "off",
    "no-tabs": "off",
    "no-trailing-spaces": "off",
    "no-whitespace-before-property": "off",
    "no-wrap-func": "off",
    "nonblock-statement-body-position": "off",
    "object-curly-newline": "off",
    "object-curly-spacing": "off",
    "object-property-newline": "off",
    "one-var-declaration-per-line": "off",
    "operator-linebreak": "off",
    "padded-blocks": "off",
    "quote-props": "off",
    quotes: "off",
    "rest-spread-spacing": "off",
    semi: "off",
    "semi-spacing": "off",
    "semi-style": "off",
    "space-after-function-name": "off",
    "space-after-keywords": "off",
    "space-before-blocks": "off",
    "space-before-function-paren": "off",
    "space-before-function-parentheses": "off",
    "space-before-keywords": "off",
    "space-in-brackets": "off",
    "space-in-parens": "off",
    "space-infix-ops": "off",
    "space-return-throw-case": "off",
    "space-unary-ops": "off",
    "space-unary-word-ops": "off",
    "switch-colon-spacing": "off",
    "template-curly-spacing": "off",
    "template-tag-spacing": "off",
    "unicode-bom": "off",
    "wrap-iife": "off",
    "wrap-regex": "off",
    "yield-star-spacing": "off",

    "@typescript-eslint/brace-style": "off",
    "@typescript-eslint/comma-dangle": "off",
    "@typescript-eslint/comma-spacing": "off",
    "@typescript-eslint/func-call-spacing": "off",
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/keyword-spacing": "off",
    "@typescript-eslint/member-delimiter-style": "off",
    "@typescript-eslint/no-extra-parens": "off",
    "@typescript-eslint/no-extra-semi": "off",
    "@typescript-eslint/quotes": "off",
    "@typescript-eslint/semi": "off",
    "@typescript-eslint/space-before-function-paren": "off",
    "@typescript-eslint/type-annotation-spacing": "off",

    "react/jsx-child-element-spacing": "off",
    "react/jsx-closing-bracket-location": "off",
    "react/jsx-closing-tag-location": "off",
    "react/jsx-curly-newline": "off",
    "react/jsx-curly-spacing": "off",
    "react/jsx-equals-spacing": "off",
    "react/jsx-first-prop-new-line": "off",
    "react/jsx-indent": "off",
    "react/jsx-indent-props": "off",
    "react/jsx-max-props-per-line": "off",
    "react/jsx-one-expression-per-line": "off",
    "react/jsx-props-no-multi-spaces": "off",
    "react/jsx-space-before-closing": "off",
    "react/jsx-tag-spacing": "off",
    "react/jsx-wrap-multilines": "off",
  },
  settings: { react: { version: "detect" } },
};
