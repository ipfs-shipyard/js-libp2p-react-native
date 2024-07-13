// Shim global JS objects, hopefully this won't be necessary forever
// https://github.com/facebook/hermes/discussions/1072

global.process = global.process ?? {}
global.process.version = 'v20.12.2'

import '@azure/core-asynciterator-polyfill'
import 'react-native-get-random-values'
import 'weakmap-polyfill'
import { TextEncoder, TextDecoder } from 'text-encoding'
import { EventTarget, Event } from 'event-target-shim'
import { Buffer } from '@craftzdog/react-native-buffer'
import { Crypto } from '@peculiar/webcrypto'

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
global.AbortSignal.prototype.throwIfAborted = () => {
  if (this.aborted) {
    throw new Error('Aborted')
  }
}

global.Buffer = Buffer
global.crypto.subtle = new Crypto().subtle

// this is not necessary for your app to run, but it helps when
// tracking down broken polyfill modules
if (global.__fbBatchedBridge) {
  const origMessageQueue = global.__fbBatchedBridge;
  const modules = origMessageQueue._remoteModuleTable;
  const methods = origMessageQueue._remoteMethodTable;
  global.findModuleByModuleAndMethodIds = (moduleId, methodId) => {
    console.log(`The problematic line code is in: ${modules[moduleId]}.${methods[moduleId][methodId]}`)
  }
}
