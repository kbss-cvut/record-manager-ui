module.exports = {
  parser: "@babel/eslint-parser",
  extends: ["plugin:react/recommended"],
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ["@babel/preset-react"],
    },
  },
  plugins: ["react"],
  rules: {}, // add specific rules here
  ignorePatterns: ["dist", "tests", ".eslintrc.cjs"],
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
