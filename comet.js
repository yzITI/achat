import { random } from './crypto.js'
import { handle } from './controller.js'

export const channel = {} // { 'channelid': { session: Set() } }
export const session = {} // { 'sessionid': { channel: Set(), ws: WebSocket, start: Date.now(), user: 'userid' } }

export function terminate (s) { // terminate session
  if (!session[s]) return
  try { session[s].ws.close() } catch {}
  for (const c of session[s].channel) {
    if (!channel[c]?.session) continue
    channel[c].session.delete(s)
    if (channel[c].session.size) continue
    delete channel[c] // clean empty
  }
  const u = session[s]?.user // may be used in the future
  delete session[s]
  console.log('[session] Closing:', s)
}

export function initialize (ws) {
  const s = random(16) // sesionid
  session[s] = { channel: new Set(), ws, start: Date.now() }
  ws.on('error', () => terminate(s))
  ws.on('close', () => terminate(s))
  ws.on('message', data => {
    try { handle(s, JSON.parse(data)) } catch {}
  })
  console.log('[session] Initializing:', s)
}

export function subscribe (s, chs) { // chs = { 'sessionid': true, 'sessionid': false }
  if (!session[s]?.ws) return
  for (const c in chs) {
    if (chs[c]) { // subscribe
      session[s].channel.add(c)
      if (!channel[c]?.session) channel[c] = { session: new Set() } 
      channel[c].session.add(s)
      continue
    }
    // unsubscribe
    session[s].channel.delete(c)
    if (!channel[c]?.session) continue
    channel[c].session.delete(s)
    if (channel[c].session.size) continue
    delete channel[c] // clean empty
  }
}

export function send (s, data) {
  if (!session[s]?.ws) return
  try { session[s].ws.send(JSON.stringify(data)) } catch {}
}

export function broadcast (c, data) { // broadcast to channel
  if (!channel[c]?.session?.size) { // check and clean
    delete channel[c]
    return
  }
  for (const s of channel[c].session) send(s, data)
}

export default { channel, session, initialize, terminate, subscribe, send, broadcast }

