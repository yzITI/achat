import { S, M } from '$lib/S.svelte.js'
import { random, sha256 } from '$lib/utilities/crypto.js'

const url = 'https://chat.yzzx.tech/ws'

let ws = null, serverTimeOffset = 0
let meta_id = ''

async function Handshake (data) {
  const serverTime = data.serverTime + (Date.now() - data.startTime) / 2
  serverTimeOffset = serverTime - Date.now()
  S.user = data.user
  console.log(`[Handshake] serverTimeOffset = ${serverTimeOffset}`, data.user)
  if (!S.channel) {
    S.channel = S.user
    S.channelInfo = { name: 'My Channel' }
  }
  if (!S.userInfo?.name) S.userInfo = { name: 'User' + S.user.substring(0, 5) }
  subscribe({ [S.token]: 1, [S.user]: 1 })
  meta_id = await sha256(await sha256(S.token + 'META_MESSAGE'))
  query(S.token, { _id: meta_id })
  query(S.channel, {}) // query current channel
}

async function Message (data) {
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
  if (data.channel !== S.channel) {
    S.channelUnread[data.channel] = 1
    return M.refreshChannelList()
  }
  for (let i = 0; i < S.messages.length; i++) {
    if (S.messages[i]._id === data._id) return S.messages[i] = data
    if (S.messages[i].created > data.created) return S.messages.splice(i, 0, data)
  }
  S.messages.push(data)
}

const handlers = { Handshake, Message }

export const connect = () => {
  ws = new WebSocket(url)
  ws.onopen = () => { if (S.token) handshake() }
  // TODO: auto reconnect
  ws.onclose = () => {}
  ws.onerror = () => {}
  ws.onmessage = e => {
    const data = JSON.parse(e.data)
    try { handlers[data.type](data) } catch {}
  }
}

connect()

export const send = data => {
  data.time = Math.floor(Date.now() + serverTimeOffset)
  ws.send(JSON.stringify(data))
}

export const handshake = () => {
  const startTime = Date.now()
  send({ type: 'handshake', token: S.token, startTime })
}

export const subscribe = channel => {
  send({ type: 'subscribe', channel })
}

export const message = (channel, msg, _id, _random) => {
  const payload = { type: 'message', channel, msg }
  if (_id) payload._id = _id
  else payload.random = _random || random(20)
  send(payload)
}

export const query = async (channel, q) => {
  send({ type: 'query', channel, query: q })
}

window.query = query
window.message = message
window.subscribe = subscribe

