import S from '$lib/S.svelte.js'
import { random } from '$lib/utilities/crypto.js'

const ws = new WebSocket('https://chat.yzzx.tech/ws')

let serverTimeOffset = 0

ws.onopen = () => {
  if (S.token) handshake()
  subscribe({ 'TEST': 1 }) // for TESTING
}

// TODO: reconnect
ws.onclose = () => {}
ws.onerror = () => {}

function Handshake (data) {
  const serverTime = data.serverTime + (Date.now() - data.startTime) / 2
  serverTimeOffset = serverTime - Date.now()
  S.user = data.user
  console.log(`[Handshake] serverTimeOffset = ${serverTimeOffset}`, data.user)
}

function Message (data) {
  if (data.channel !== S.channel) return // TODO: new message for other channels
  S.messages.push(data)
}

const handlers = { Handshake, Message }

ws.onmessage = e => {
  const data = JSON.parse(e.data)
  try { handlers[data.type](data) } catch {}
}

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

export const message = async (channel, msg) => {
  const r = await random(20)
  send({ type: 'message', random: r, channel, msg })
}

