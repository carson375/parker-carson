import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 1. Basic ESLint recommended rules
  js.configs.recommended,

  // 2. Base ignores
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "postcss.config.js",
      "tailwind.config.js",
    ],
  },

  // 3. TypeScript configuration
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    rules: {
      ...typescriptEslint.configs.recommended.rules,
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "no-unused-vars": "off",
    },
  },

  // 4. Prettier integration
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierPlugin.configs?.recommended?.rules,
      "prettier/prettier": [
        "error",
        {
          "endOfLine": "auto",
        },
      ],
    },
  },

  // 5. Next.js specific rules (using compat for just the essential parts)
  ...compat.extends("next/core-web-vitals"),

  // 6. Custom rules
  {
    rules: {
      "import/order": [
        "error",
        {
          "groups": ["builtin", "external", "internal"],
          "pathGroups": [
            {
              "pattern": "react",
              "group": "external",
              "position": "before",
            },
          ],
          "pathGroupsExcludedImportTypes": ["react"],
          "newlines-between": "always",
          "alphabetize": {
            "order": "asc",
            "caseInsensitive": true,
          },
        },
      ],
      "no-console": "warn",
    },
  },
];

export default eslintConfig;
