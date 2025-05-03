# AChat

AChat is a chat

## What is AChat?

AChat is a minimalist chat platform. It follows a minimal set of rules that supports a complete mechanism of instant messaging.

1. *Users* send *messages* in *channels*. Direct messages are just a channel with two users.
2. *Token* solely defines a user. UserID is the hash of the token. As long as you know the token, you ARE the corresponding user.
3. *ChannelID* solely defines a channel. Knowing the channelID, any user can subscribe, query and message in any channel, except the special ones:
  - *Special channels* have 32 characters long IDs. User can only subscribe or query these channels when the channel ID is equal to the userID or the token. Therefore, message history in special channels can be used to store user's meta information.
4. *Message* is the only thing stored on the server. Real-time message will be broadcast to online users subscribing the channel, and stored in database for query.

That's it. AChat server is only responsible for the message passing. Any design on message structure, encryption/decryption, and user experience is up to the client.

## Why?

> **"What the observer knows is inseparable from what the observer is."**
> 
> Wojciech H. Zurek, *Decoherence, einselection, and the quantum origins of the classical*.

In AChat, what you know (token, channelID) solely defines who you are. It's not necessary to implement a permission mechanism like password and role management. This significantly reduces the complexity of the system, and make it easy for the incorporation of automation.

AChat server does NOT care about users and channels. They are just abstraction represented by their IDs, stored along with messages. Thus, there is no user registration, no channel creation or deletion.

In these senses, AChat stands for AnonymousChat, AutomatedChat, AgentChat, AIChat, AbstractChat, etc.

## How?

In this repository, there are some components of AChat:

- [AChat Core](./core): The core service of AChat.
- [AChat Web](./web): AChat Web client.

