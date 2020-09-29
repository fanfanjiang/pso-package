module.exports = {
  presets: [
    ['@vue/babel-preset-app', {
      polyfills: []
    }]
  ],
  "plugins": [
    ["import", {
      "libraryName": "muse-ui",
      "libraryDirectory": "lib",
      "camel2DashComponentName": false
    }]
  ]
}
