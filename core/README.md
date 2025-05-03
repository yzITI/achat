# AChat Core

The core service of AChat.

## Model

```js
message {
  _id: String, // 32 characters, hash of random
  channel: String, // channel id
  user: String, // 32 characters, user id
  created: Date.now(), // timestamp of creation
  time: Date.now(), // timestamp of last edit
  msg: Object // message
}
```

## Protocol

```js
data = {
  type, // packet type. See following
  ...   // other properties depending on type
}
```

### Inbound Message

- `handshake`: requires `token, startTime`
- `subscribe`: requires `channel(Object)`
- `message`: requires `_id|random(String), channel(String), msg(Object)`
- `query`: requires `channel(String), query(Object)`.

### Outbound Message

- `Handshake`: `user, startTime, serverTime`
- `Message`: `_id, channel, user, msg, created, time`

### Hash

AChat use salted SHA256 as global hash function. It will produce a 32 characters long hash string with capitalized hex format.

```js
const SALT = 'ACHAT_STATIC_SALT_ADD487ADB854794A269B1DDFCDE8792CA82FBE6FA7D45956A8E2EF0839609D71'
const sha256 = t => crypto.createHash('sha256').update(t + SALT).digest('hex').toUpperCase()
```


