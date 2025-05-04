# AChat Web

This is *a* client for AChat.

## Build

```
npm i && npm run build
```

## Convention

### User Identity

User identity and permission are solely represented by **passcode**, which can be arbitrary length. Each `->` below means HASH.

```
passcode -> userKey -> token -> userID
```

### End-to-end Encryption

AChat Web use AES as E2E encryption algorithm. For any non-special channel, the channelID will be the hash of the AES key.

### Meta Message

Meta information of user is stored in self-channel (the channel with token as channelID). The message random is hash of `token + 'META_MESSAGE'`, which gives the message _id as the hash of random.

The message content follows the following convention:

```js
msg { // meta message
  type: 'meta',
  userInfo: {
    name: String, // user name
    avatar: String // user avatar URL
  },
  channels: {
    [channelID]: {
      name: String // channel name
    },
    ...
  },
  users: {
    [userID]: {
      nickname: String // user name
    },
    ...
  }
}
```

