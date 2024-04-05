module.exports = {
  parser: "@babel/eslint-parser",
  extends: ["plugin:react/recommended", "prettier"],
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ["@babel/preset-react"],
    },
  },
  plugins: ["react", "react-hooks"],
  overrides: [
    {
      files: ["*.js", "*.jsx"], // Target all JSX files
      rules: {
        strict: ["error", "global"], // Apply "use strict" globally within src folder
      },
    },
  ],
  ignorePatterns: ["dist", "tests", "public", ".eslintrc.cjs"],
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx"],
      },
    },
  },
  env: {
    browser: true,
  },
};
