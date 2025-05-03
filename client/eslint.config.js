import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true, // 🟢 this enables JSX parsing
        },
      },
    },
    plugins: {
      react: pluginReact,
    },
    rules: {
      "react/prop-types": "off", // optional: disables prop validation warning
    },
  },
]);
