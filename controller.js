import comet from './comet.js'

const handler = {}

handler.subscribe = async (session, data) => {
  console.log('This is subscribe handler')
}

handler.message = async (session, data) => {
  console.log('This is message handler')
}

handler.query = async (session, data) => {
  console.log('This is query handler')
}

export function handle (session, data) {
  if (!handler.hasOwnProperty(data.type)) return
  handler[data.type](session, data)
}

