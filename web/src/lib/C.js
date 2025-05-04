// This interface will transform channelKey into channelID
// all `channel` exposed by this interface is channelKey
import { S, M } from '$lib/S.svelte.js'
import * as sdk from '$lib/../../../sdk/browser.js'

const url = 'https://chat.yzzx.tech/ws'
let meta_id = ''

export const random = sdk.random

const rainbow = {} // invert known hash values
export const hash = async str => {
  const res = await sdk.hash(str)
  rainbow[res] = str
  return res
}

sdk.events.onConnect = () => {
  if (S.token) sdk.handshake(S.token)
}

sdk.events.onHandshake = async data => {
  S.user = data.user
  if (!S.userInfo?.name) S.userInfo = { name: 'User' + S.user.substring(0, 5) }
  subscribe({ [S.userKey]: 1 })
  meta_id = await hash(await hash(S.token + 'META_MESSAGE'))
  query(S.userKey, { _id: meta_id })
  if (S.channel) { // current channel
    query(S.channel, {})
    subscribe({ [S.channel]: 1 })
  }
}

sdk.events.onMessage = async data => {
  // TODO: decryption
  if (data._id === meta_id) { // meta message
    S.meta = data.msg
    S.userInfo = S.meta.userInfo || {}
    if (!S.userInfo.name) S.userInfo.name = 'User' + S.user.substring(0, 5)
    const channels = {}
    for (const c in S.meta.channels) {
      if (c === S.token || c === S.user) continue
      channels[c] = 1
    }
    subscribe(channels)
    return M.refreshChannelList()
  }
  const channel = rainbow[data.channel]
  if (channel !== S.channel) {
    S.channelUnread[channel] = 1
    return M.refreshChannelList()
  }
  for (let i = 0; i < S.messages.length; i++) {
    if (S.messages[i]._id === data._id) return S.messages[i] = data
    if (S.messages[i].created > data.created) return S.messages.splice(i, 0, data)
  }
  S.messages.push(data)
}

export const connect = () => sdk.connect(url)
connect()

export const handshake = () => sdk.handshake(S.token)

export const subscribe = async chs => {
  const channel = {}
  for (const c in chs) channel[await hash(c)] = chs[c]
  sdk.subscribe(channel)
}

export const message = async (channel, msg, _id, _random) => {
  const _channel = await hash(channel)
  const _msg = msg
  // TODO: encryption
  sdk.message(_channel, _msg, _id, _random)
}

export const query = async (channel, q) => sdk.query(await hash(channel), q)

export const updateMeta = async () => {
  message(S.userKey, S.meta, undefined, await hash(S.token + 'META_MESSAGE'))
}

window.query = query
window.message = message
window.subscribe = subscribe

