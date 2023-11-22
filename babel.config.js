module.exports = {
  "plugins": [
  "lodash",
  "@babel/plugin-proposal-class-properties",
  "@babel/plugin-transform-runtime"
],
    "presets": [
  [
    "@babel/preset-env",
    {
      "targets": {
        "node": 18, // If you are running on Node.js
        "browsers": "last 2 versions, > 0.2%, ie 11, not dead"
      },
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
        "@babel/preset-env",
        {
          "targets": {
            "node": "current"
          }
        }
      ],
      "@babel/preset-react"
    ]
  }
  }
}
