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
  const message = { id: data.id, channel: data.channel, time: Date.now(), msg: data.msg }
  comet.broadcast(data.channel, { type: 'Message', ...message })
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

