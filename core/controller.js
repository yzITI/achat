import { M } from './model.js'
import comet from './comet.js'
import { sha256, random } from './crypto.js'

const handler = {}

handler.handshake = async (s, data) => {
  if (!data.token) return
  comet.session[s].user = sha256(data.token)
  comet.send(s, { type: 'Handshake', user: comet.session[s].user, startTime: data.startTime, serverTime: Date.now() })
}

handler.subscribe = async (s, data) => {
  if (!comet.session[s].user) return
  comet.subscribe(s, data.channel || {})
}

// wrap message function for both ws and http
export const message = async (user, data) => {
  if (!user) return
  if (data._id) { // edit message
    const m = await M.get({ _id: data._id, channel: data.channel })
    if (!m || m.user !== user) return
    m.time = Date.now()
    m.msg = data.msg
    await M.put({ _id: data._id }, m)
    comet.broadcast(data.channel, { type: 'Message', ...m })
    return
  }
  // new message
  const _id = sha256(data.random || random(16))
  const message = { channel: data.channel, user, created: Date.now(), time: Date.now(), expire: data.expire, msg: data.msg }
  if (!message.expire || message.expire > Date.now()) await M.put({ _id }, message)
  comet.broadcast(data.channel, { type: 'Message', _id, ...message })
}

handler.message = (s, data) => message(comet.session[s].user, data)

handler.query = async (s, data) => {
  if (!comet.session[s].user) return
  if (!data.channel || typeof data.channel !== 'string') return
  const query = { _id: data.query?._id, channel: data.channel, time: data.query?.time, created: data.query?.created, user: data.query?.user }
  const raw = await M.find(JSON.parse(JSON.stringify(query)), { sort: { created: -1 }, limit: 20 })
  for (const m of raw) comet.send(s, { type: 'Message', ...m })
}

export function handle (s, data) {
  if (!comet.session[s]?.ws) return
  if (!handler.hasOwnProperty(data.type)) return
  handler[data.type](s, data)
}

