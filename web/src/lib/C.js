import S from '$lib/S.svelte.js'
import { random, sha256 } from '$lib/utilities/crypto.js'

let ws = null, serverTimeOffset = 0

function Handshake (data) {
  const serverTime = data.serverTime + (Date.now() - data.startTime) / 2
  serverTimeOffset = serverTime - Date.now()
  S.user = data.user
  console.log(`[Handshake] serverTimeOffset = ${serverTimeOffset}`, data.user)
  S.channel = S.user
  S.channelInfo = { name: 'My Channel' }
  subscribe({ 'TEST': 1, [S.token]: 1, [S.user]: 1 })
  query(S.token, { _id: sha256(S.token + 'META_MESSAGE') })
}

function Message (data) {
  console.log(`[Message]`, data)
  if (data.channel !== S.channel) return // TODO: new message for other channels
  S.messages.push(data)
}

const handlers = { Handshake, Message }

export const connect = () => {
  ws = new WebSocket('https://chat.yzzx.tech/ws')
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

