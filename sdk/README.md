# AChat SDK 

The SDK is only responsible for basic communication. Cryptography, meta-information, and other personalized features are up to clients.

One implementation is from the [web client](../web/src/lib/C.js), where the browser SDK is further abstracted to integrate E2E encryption and other features.

## API

APIs are the same for both browser and node.js.

```js
import { events, connect, handshake, subscribe, message, query, hash } from './browser.js'

token = '1234567890'

events.onConnect = () => { handshake(token) }
connect('https://server.endpoint/ws')

events.onMessage = data => {
  console.log('New Message', data)
}

subscribe({ 'CHANNEL1': 1, 'CHANNEL2': 1, 'CHANNEL3': 0 })

message('CHANNEL1', { content: 'Hello World' })

query(await hash(token), {})
```

