import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/**
 * Helper to strip circular references from legacy plugins
 * which cause ESLint 9 to crash during validation.
 */
function sanitizeConfig(configs) {
  return configs.map((config) => {
    if (config.plugins) {
      const safePlugins = {};
      for (const [name, plugin] of Object.entries(config.plugins)) {
        safePlugins[name] = { ...plugin };
        // The circularity usually lives in the 'configs' properties 
        // of the plugin object itself when it points back to the plugin.
        delete safePlugins[name].configs;
      }
      return { ...config, plugins: safePlugins };
    }
    return config;
  });
}

const eslintConfig = [
  js.configs.recommended,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "postcss.config.js",
      "tailwind.config.js",
      "public/**",
    ],
  },
  // Sanitize the Next.js legacy configs to prevent circular structure errors
  ...sanitizeConfig(compat.extends("next/core-web-vitals", "plugin:@typescript-eslint/recommended")),
  {
    rules: {
      "no-unused-vars": "off",
      "no-console": "warn",
      "@typescript-eslint/no-unused-vars": "off",
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
    },
  },
];

export default eslintConfig;
