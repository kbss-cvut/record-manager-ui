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
  settings: {
    react: {
      version: "detect",
    },
  },
};
