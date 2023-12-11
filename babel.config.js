module.exports = function (api) {
  api.cache(true)

  return {
    presets: [
      'babel-preset-expo'
    ],
    plugins: [
      ['module-resolver', {
        alias: {
          'crypto': 'crypto-browserify',
          'node:crypto': 'crypto-browserify',
          'stream': 'stream-browserify',
          'node:stream': 'stream-browserify'
        }
      }],
      ['@babel/plugin-transform-private-methods', { loose: true }]
    ]
  }
}
