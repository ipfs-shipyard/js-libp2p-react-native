# Running js-libp2p under React Native

There is some setup that needs to be done to modernise the react-native runtime.

1. Turn on [exports map support](https://reactnative.dev/blog/2023/06/21/package-exports-support)

```js
// metro.config.js
module.exports = {
  resolver: {
    unstable_enablePackageExports: true,
  }
}
```

2. Shimming globals

Some standard JS APIs aren't available in React Native, these need to be polyfilled, hopefully [not forever](https://github.com/facebook/hermes/discussions/1072).

```js
// globals.js - this should be imported at the top of your App.js file
import '@azure/core-asynciterator-polyfill'
import 'react-native-url-polyfill/auto'
import 'react-native-get-random-values'
import 'weakmap-polyfill'
import { TextEncoder, TextDecoder } from 'text-encoding'
import { EventTarget, Event } from 'event-target-shim'
import { Buffer } from '@craftzdog/react-native-buffer'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
global.EventTarget = EventTarget
global.Event = Event

global.AbortSignal.timeout = (ms) => {
  const controller = new AbortController()
  setTimeout(() => {
    controller.abort(new Error('Aborted'))
  }, ms)
}
global.Buffer = Buffer
```

3. WebCrypto

It's necessary to shim support for [SubtleCrypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto)
until it's added to react-native by default.

First install the necessary dependencies:

```console
$ npm i @peculiar/webcrypto
```

..and create a shim file:

```js
// globals-crypto.js - this should be imported at the top of your App.js file
// but AFTER globals.js
import { Crypto } from '@peculiar/webcrypto'

global.crypto.subtle = new Crypto().subtle
```

IMPORTANT: until [PeculiarVentures/webcrypto#67](https://github.com/PeculiarVentures/webcrypto/pull/67) is
merged, SubtleCrypto has to be shimmed *after* the node Buffer polyfill has
been added to the global context.

3. Enable modern JS features

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

- By default this demo uses pure-js crypto - it's not efficient enough to run on an actual device, `crypto-browserify` should be replaced with `react-native-quick-crypto` in `bable.config.js` for native builds
- `@libp2p/webrtc` can also only run on a device since it needs native code

### Debugging

Put this at the top of your app file:

```js
import debug from 'debug'

debug.enable('libp2p:*')
```
