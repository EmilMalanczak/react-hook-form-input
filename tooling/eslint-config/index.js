/** @type {import("eslint").Linter.Config} */
const config = {
  extends: [
    // "turbo",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  env: {
    es2022: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint", "import"],
  rules: {
    "turbo/no-undeclared-env-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      { prefer: "type-imports", fixStyle: "separate-type-imports" },
    ],
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "@typescript-eslint/no-misused-promises": [
      2,
      { checksVoidReturn: { attributes: false } },
    ],
    "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
    "import/extensions": "off",
    "import/no-extraneous-dependencies": "off",
    "import/prefer-default-export": "off",

    "no-underscore-dangle": "off",
    "no-param-reassign": [
      2,
      {
        props: false,
      },
    ],
    "arrow-parens": ["error", "always"],
    "object-curly-newline": [
      "error",
      {
        consistent: true,
        multiline: true,
      },
    ],
    "no-case-declarations": "off",
    "no-control-regex": "off",
    "implicit-arrow-linebreak": "off",
    semi: "off",
    "quote-props": [2, "as-needed"],
    "comma-dangle": "off",
    "linebreak-style": "off",
    "function-paren-newline": "off",
    indent: "off",
    "no-undef": "off",
    "no-shadow": "off",
    "max-len": ["off", { ignoreComments: true, code: 100 }],

    "operator-linebreak": ["off"],
    "no-unused-vars": "off",
    "newline-after-import": "off",
    camelcase: "off",
  },
  ignorePatterns: [
    "**/*.config.js",
    "**/*.config.cjs",
    "**/.eslintrc.cjs",
    ".next",
    "dist",
    "pnpm-lock.yaml",
  ],
  reportUnusedDisableDirectives: true,
};

module.exports = config;
