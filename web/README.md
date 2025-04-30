# AChat Web

This is *a* client for AChat Server.

## Convention

### User Identity

User identity and permission are solely represented by **passcode**. **token** is the hash of passcode, and **userID** is the hash of token.

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

