module.exports = {
  extends: [
    "airbnb",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "prettier",
  ],
  plugins: ["react", "react-hooks", "jsx-a11y"],
  rules: {}, // add specific rules here
  ignorePatterns: ["dist", "tests", ".eslintrc.cjs"],
  settings: {
    react: {
      version: "detect",
    },
  },
};
