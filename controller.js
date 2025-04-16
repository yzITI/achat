import { M } from './model.js'
import comet from './comet.js'
import { sha256 } from './crypto.js'

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

handler.message = async (s, data) => {
  if (!comet.session[s].user) return
  // TODO: edit existing message
  const _id = sha256(data.random)
  const message = { channel: data.channel, user: comet.session[s].user, time: Date.now(), msg: data.msg }
  await M.put({ _id }, message)
  comet.broadcast(data.channel, { type: 'Message', _id, ...message })
}

handler.query = async (s, data) => {
  if (!comet.session[s].user) return
  console.log('This is query handler')
}

export function handle (s, data) {
  if (!comet.session[s]?.ws) return
  if (!handler.hasOwnProperty(data.type)) return
  handler[data.type](s, data)
}

