// Shim global JS objects, hopefully this won't be necessary forever
// https://github.com/facebook/hermes/discussions/1072

global.process = global.process ?? {}
global.process.version = 'v20.12.2'

import '@azure/core-asynciterator-polyfill'
import 'react-native-get-random-values'
import 'weakmap-polyfill'
import { EventTarget, Event } from 'event-target-shim'
import { Buffer } from '@craftzdog/react-native-buffer'
import { Crypto } from '@peculiar/webcrypto'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'

/**
 * Ref: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
 */
global.EventTarget = global.EventTarget ?? EventTarget

/**
 * Ref: https://developer.mozilla.org/en-US/docs/Web/API/Event
 */
global.Event = global.Event ?? Event

/**
 * CustomEvent is a standard event but it's not supported by react-native
 *
 * Ref: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 * Ref: https://github.com/facebook/react-native/issues/38004
 */
global.CustomEvent = global.CustomEvent ?? class CustomEventPolyfill extends Event {
  constructor (message, data) {
    super(message, data)

    this.detail = data?.detail
  }
}

/**
 * Ref: https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static
 */
global.AbortSignal.timeout = global.AbortSignal.timeout ?? ((ms) => {
  const controller = new AbortController()
  setTimeout(() => {
    controller.abort(new Error('Aborted'))
  }, ms)
})

/**
 * Ref: https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/throwIfAborted
 */
global.AbortSignal.prototype.throwIfAborted = global.AbortSignal.prototype.throwIfAborted ?? (() => {
  if (this.aborted) {
    throw new Error('Aborted')
  }
})

/**
 * Some older Node.js modules use `Buffer` from the global scope instead of
 * importing it from `node:buffer`.
 */
global.Buffer = global.Buffer ?? Buffer

/**
 * Ref: https://developer.mozilla.org/en-US/docs/Web/API/Crypto
 */
global.crypto = global.crypto ?? {}
global.crypto.subtle = global.crypto.subtle ?? new Crypto().subtle

/**
 * Polyfill missing ES2024 promise methods
 *
 * Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers
 */
global.Promise.withResolvers = global.Promise.withResolvers ?? (() => {
  let res
  let rej

  const p = new Promise((resolve, reject) => {
    res = resolve
    rej = reject
  })

  return {
    promise: p,
    resolve: res,
    reject: rej
  }
})

/**
 * Sometimes this is undefined, though perhaps only in the simulator
 *
 * Ref: https://github.com/craftzdog/react-native-quick-base64/issues/25
 */
global.base64FromArrayBuffer = global.base64FromArrayBuffer ?? ((buf) => {
  return uint8ArrayToString(new Uint8Array(buf, 0, buf.byteLength), 'base64')
})

/**
 * this is not necessary for your app to run, but it helps when tracking down
 * broken polyfill modules
 */
if (global.__fbBatchedBridge) {
  const origMessageQueue = global.__fbBatchedBridge;
  const modules = origMessageQueue._remoteModuleTable;
  const methods = origMessageQueue._remoteMethodTable;
  global.findModuleByModuleAndMethodIds = (moduleId, methodId) => {
    console.log(`The problematic line code is in: ${modules[moduleId]}.${methods[moduleId][methodId]}`)
  }
}
