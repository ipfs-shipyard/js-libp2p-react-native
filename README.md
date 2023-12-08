# Running js-libp2p under React Native

Very basic support so far, just js-libp2p itself, no extra modules yet.

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
import 'react-native-get-random-values'
import { TextEncoder, TextDecoder } from 'text-encoding'
import { EventTarget, Event } from 'event-target-shim'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
global.EventTarget = EventTarget
global.Event = Event
```

## Running

### iOS

1. Install XCode
2. Install iOS (XCode > Settings > Platforms > Install the latest iOS version)

### Android

1. ???

### Start

Start [Expo](https://expo.dev/):

```console
$ npm i
$ npm start
```

Follow the instructions - press `i` to start iOS or `a` for Android.
