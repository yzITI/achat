import S from '$lib/S.svelte.js'

const ws = new WebSocket('https://lsh.yzzx.tech/ws')

let serverTimeOffset = 0

ws.onopen = () => {
  if (S.token) handshake()
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

function Message (data) {}

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

