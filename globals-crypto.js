// Ship SubtleCrypto - this has do be done after the Buffer polyfill has been
// added to the global object. Can be folded into `./globals.js` if
// https://github.com/PeculiarVentures/webcrypto/pull/67 is merged

import { Crypto } from '@peculiar/webcrypto'

global.crypto.subtle = new Crypto().subtle
