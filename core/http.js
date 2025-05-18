import { message } from './controller.js'
import { sha256 } from './crypto.js'

export default async function (req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'text/plain' })
    res.end('Method Not Allowed')
    return
  }
  const data = await new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', () => { resolve(JSON.parse(body)) })
  })
  if (!data.token || !data.channel) {
    res.writeHead(400, { 'Content-Type': 'text/plain' })
    res.end('Bad Request')
    return
  }
  await message(sha256(data.token), data)
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('OK')
}
