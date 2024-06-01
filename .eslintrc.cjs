/**
 * @type {import('eslint').Options}
 */
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  globals: {
    window: true
  },
  settings: {
    "import/resolver": {
      typescript: {} // this loads <rootdir>/tsconfig.json to eslint
    }
  },
  overrides: [
    {
      files: ["**/*.cjs"],
      env: {
        node: true
      }
    }
  ],
  ignorePatterns: ["dist", ".eslintrc.mjs"],
  parser: "@typescript-eslint/parser",
  plugins: [
    "react-refresh",
    "@typescript-eslint",
    "import",
    "react-hooks",
    "prettier"
  ],
  rules: {
    // eslint-plugin-react-hooks
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true }
    ],

    // react-hooks
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    // @typescript-eslint/eslint-plugin
    "@typescript-eslint/no-shadow": ["error"],
    "@typescript-eslint/ban-ts-comment": "warn",
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    // eslint-plugin-import
    "import/extensions": "off",
    "import/no-extraneous-dependencies": "off",
    "import/prefer-default-export": "off",
    "import/order": [
      1,
      {
        groups: [
          ["external", "builtin"],
          "type",
          "internal",
          "sibling",
          "parent",
          "index"
        ],
        pathGroups: [
          {
            pattern:
              "assets|common|components|hooks|store|features|interfaces|constants|api",
            group: "internal"
          }
        ],
        pathGroupsExcludedImportTypes: ["internal"],
        alphabetize: {
          order: "asc",
          caseInsensitive: true
        },
        "newlines-between": "always"
      }
    ],
    // eslint
    "no-underscore-dangle": "off",
    "no-param-reassign": [
      2,
      {
        props: false
      }
    ],
    "arrow-parens": ["error", "always"],
    "object-curly-newline": [
      "error",
      {
        consistent: true,
        multiline: true
      }
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
    camelcase: "off"
  }
}
