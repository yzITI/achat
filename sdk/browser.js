// hash functions
const enc = new TextEncoder('utf-8')
const SALT = 'ACHAT_STATIC_SALT_ADD487ADB854794A269B1DDFCDE8792CA82FBE6FA7D45956A8E2EF0839609D71'
export const HEX = buffer => Array.from(new Uint8Array(buffer)).map(byte => byte.toString(16).padStart(2, '0')).join('').toUpperCase()
export function random (l) {
  const a = new Uint8Array(l)
  window.crypto.getRandomValues(a)
  return HEX(a)
}
export const hash = str => window.crypto.subtle.digest('SHA-256', enc.encode(str + SALT)).then(HEX)

const url = '/ws'

let ws = null, serverTimeOffset = 0

export const events = {
  onConnect: () => {},
  onDisconnect: () => {},
  onMessage: () => {},
  onHandshake: () => {}
}

const handlers = {
  Handshake: data => {
    serverTimeOffset = data.serverTime - (Date.now() + data.startTime) / 2
    events.onHandshake(data)
  },
  Message: data => events.onMessage(data)
}

export const connect = url => {
  console.log('connecting')
  if (ws?.readyState === 1) ws.close()
  ws = new WebSocket(url)
  ws.onopen = events.onConnect
  ws.onclose = ws.onerror = () => {
    events.onDisconnect()
    setTimeout(() => {
      if (ws.readyState > 1) connect(url)
    }, 5e3)
  }
  ws.onmessage = e => {
    const data = JSON.parse(e.data)
    try { handlers[data.type](data) } catch {}
  }
}

const send = data => {
  data.time = Math.floor(Date.now() + serverTimeOffset)
  ws.send(JSON.stringify(data))
}

export const handshake = token => {
  const startTime = Date.now()
  send({ type: 'handshake', token, startTime })
}

export const subscribe = channel => {
  send({ type: 'subscribe', channel })
}

export const message = (channel, msg, _id = undefined, _random = undefined, expire = undefined) => {
  const payload = { type: 'message', channel, expire, msg }
  if (_id) payload._id = _id
  else payload.random = _random || random(20)
  send(payload)
}

export const query = async (channel, q) => {
  send({ type: 'query', channel, query: q })
}

