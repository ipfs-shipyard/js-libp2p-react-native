// Shim global JS objects, hopefully this won't be necessary forever
// https://github.com/facebook/hermes/discussions/1072

import 'react-native-get-random-values'
import { TextEncoder, TextDecoder } from 'text-encoding'
import { EventTarget, Event } from 'event-target-shim'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
global.EventTarget = EventTarget
global.Event = Event
