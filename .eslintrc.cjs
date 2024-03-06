module.exports = {
  parser: "@babel/eslint-parser",
  extends: ["plugin:react/recommended"],
  parserOptions: {
    ecmaVersion: 2020,
    requireConfigFile: false,
  },
  plugins: ["react"],
  rules: {}, // add specific rules here
  ignorePatterns: ["dist", "tests", ".eslintrc.cjs"],
  settings: {
    react: {
      version: "detect",
    },
  },
  env: {
    browser: true,
  },
};
