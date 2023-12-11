module.exports = function (api) {
  api.cache(true)

  return {
    presets: [
      'babel-preset-expo'
    ],
    plugins: [
      ['module-resolver', {
        alias: {
          'crypto': 'react-native-quick-crypto',
          'node:crypto': 'react-native-quick-crypto',
          'stream': 'stream-browserify',
          'node:stream': 'stream-browserify',
          'net': 'react-native-tcp-socket',
          'node:net': 'react-native-tcp-socket',
          'os': 'os-browserify',
          'node:os': 'os-browserify',
          'path': 'path-browserify',
          'node:path': 'path-browserify'
        }
      }],
      ['@babel/plugin-transform-private-methods', { loose: true }]
    ]
  }
}
