# Running js-libp2p under React Native

There is some setup that needs to be done to modernise the react-native runtime.

1. Shimming globals

Some standard JS APIs aren't available in React Native, these need to be polyfilled, hopefully [not forever](https://github.com/facebook/hermes/discussions/1072).

See [./globals.js](./globals.js) for the changes you need to make.

2. Enable modern JS features

- libp2p uses [ES2022 private properties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties) in some places, so enable transpiling them for use with React Native. At the time of writing [loose mode](https://2ality.com/2015/12/babel6-loose-mode.html) is also required.

```console
$ npm i -D @babel/plugin-transform-private-methods
```

```js
// babel.config.js
module.exports = {
  //... other config
  plugins: [
    ['@babel/plugin-transform-private-methods', { loose: true }]
  ]
}
```

3. Add support for missing Node.js APIs

Some dependencies use Node.js APIs so these need to be added to the module resolver.

See [./babel-config.js](./babel-config.js) for the changes you need to make.

## Running

### Prerequisites

Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

### Run in the simulator

Start [Expo](https://expo.dev/):

```console
$ npm i
$ npm start
```

Follow the instructions - press `i` to start iOS or `a` for Android.

### Run on a device

See the [expo docs](https://docs.expo.dev/guides/local-app-development/)

```console
$ npx expo run:android --device
```

For iOS you will need to provision a device certificate as normal.

```console
$ npx expo run:ios --device
```

## Notes

- `@libp2p/webrtc` can only run on a device since it needs native code

### Debugging

Put this at the top of your app file:

```js
import debug from 'weald'

debug.enable('libp2p:*')
```
