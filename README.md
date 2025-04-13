# AChat

AChat is a chat

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
- `message`: requires `id(String), channel(String), msg(Object)`
- `query`: TBD.

### Outbound Message

- `Handshake`: `user, startTime, serverTime`
- `Message`: `id, channel, user, msg`

