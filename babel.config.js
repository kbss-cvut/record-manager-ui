module.exports = {
  "plugins": [
    "lodash",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-transform-runtime",
    "@babel/plugin-transform-nullish-coalescing-operator",
    "@babel/plugin-transform-modules-commonjs"
  ],
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false,
        "useBuiltIns": "usage",
        "corejs": {
          "version": 3,
          "proposals": true
        }
      }
    ],
    "@babel/preset-react"
  ],
  "env": {
    "test": {
      "presets": [
        [
          "@babel/preset-env"
        ],
        "@babel/preset-react"
      ]
    }
  }
}
