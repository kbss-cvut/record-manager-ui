module.exports = {
  roots: ["<rootDir>"],
  moduleFileExtensions: ["js", "jsx", "json"],
  setupFiles: ["<rootDir>/tests/setup.js"],
  testEnvironment: "jsdom",
  testURL: "http://localhost:8080/record-manager",
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  transformIgnorePatterns: ["node_modules/(?!@kbss-cvut)/"],
  reporters: ["default"],
  moduleNameMapper: {
    "\\.(css)$": "<rootDir>/tests/__mocks__/styleMock.js",
  },
};
