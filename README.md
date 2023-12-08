# Running js-libp2p under React Native

Very basic support so far, just js-libp2p itself, no extra modules yet.

1. Turn on exports map support

```js
// metro.config.js
module.exports = {
  resolver: {
    unstable_enablePackageExports: true,
  }
}
```

2. Shimming globals

Some standard JS APIs aren't available in React Native:

   1. `crypto.getRandomValues` - `react-native-get-random-values`
   2. `TextEncoder`/`TextDecoder` - `text-encoding`
   3. `EventTarget`/`Event` - `event-target-shim`

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
